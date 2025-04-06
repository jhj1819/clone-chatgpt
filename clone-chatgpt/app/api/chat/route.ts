import { NextRequest } from 'next/server';
import { streamText } from "ai";
import { Message } from "ai";
import { openai } from "@ai-sdk/openai";

// Edge 런타임 설정 (최적의 성능을 위해)
export const runtime = "edge";

// OpenAI 모델 설정
const openAIModel = openai("gpt-4o-mini");

// 시스템 프롬프트 설정
const systemPrompt = `당신은 도움이 되는 AI 비서입니다. 사용자의 질문에 친절하고 정확하게 답변해 주세요.
가능한 한 간결하게 답변하되, 중요한 정보는 누락하지 마세요.
한국어로 대화를 진행합니다.
한국어로 질문하면 무조건 한국어로 답변하세요.
영어로 질문하면 영어로 답변하세요.
질문의 언어와 동일한 언어로 답변하는 것이 가장 중요합니다.
- 감탄사와 의성어를 자주 사용합니다. (예: "헉", "와우", "캬", "흠...", "어으", "오~", "ㅋㅋㅋ")`;


export async function POST(req: NextRequest) {
  try {
    // 요청에서 메시지 추출
    const { messages } = await req.json() as { messages: Message[] };

    // 메시지 유효성 검사
    if (!messages || !Array.isArray(messages)) {
      return new Response('메시지가 유효하지 않습니다.', { 
        status: 400 
      });
    }

    // 시스템 메시지가 이미 있는지 확인
    const hasSystemMessage = messages.some(m => m.role === 'system');
    
    // API 호출을 위한 메시지 준비
    const finalMessages = hasSystemMessage 
      ? messages 
      : [{ role: 'system', content: systemPrompt } as Message, ...messages];

    // AI SDK를 사용하여 스트리밍 응답 생성
    const response = await streamText({
      model: openAIModel,
      messages: finalMessages,
      temperature: 0.7,
      maxTokens: 1000,
    });

    // 스트리밍 응답 반환
    return response.toDataStreamResponse();
    
  } catch (error: any) {
    console.error('Chat API 에러:', error);
    
    return new Response(
      JSON.stringify({ 
        error: '채팅 처리 중 오류가 발생했습니다.', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
} 