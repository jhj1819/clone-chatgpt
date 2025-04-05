import { NextRequest } from 'next/server';
import { Message as AIMessage } from 'ai';
import OpenAI from 'openai';

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// 시스템 프롬프트 설정
const systemPrompt = `당신은 도움이 되는 AI 비서입니다. 사용자의 질문에 친절하고 정확하게 답변해 주세요.
가능한 한 간결하게 답변하되, 중요한 정보는 누락하지 마세요.
한국어로 대화를 진행합니다.`;

export async function POST(req: NextRequest) {
  try {
    // 요청에서 메시지 추출
    const { messages } = await req.json();

    // 메시지 유효성 검사
    if (!messages || !Array.isArray(messages)) {
      return new Response('메시지가 유효하지 않습니다.', { status: 400 });
    }

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    // 응답 스트림 생성
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    let counter = 0;
    
    const stream = new ReadableStream({
      async start(controller) {
        // 스트림 청크를 처리하는 콜백
        function onParse(event: any) {
          if (event.type === 'event') {
            const data = event.data;
            
            // [DONE] 메시지로 스트림 종료
            if (data === '[DONE]') {
              controller.close();
              return;
            }
            
            try {
              const json = JSON.parse(data);
              const text = json.choices[0]?.delta?.content || '';
              
              if (counter < 2 && (text.match(/\n/) || []).length) {
                // 처음 몇 줄은 무시 (선택 사항)
                return;
              }
              
              const queue = encoder.encode(text);
              controller.enqueue(queue);
              counter++;
            } catch (e) {
              // 파싱 오류 처리
              controller.error(e);
            }
          }
        }
        
        // 응답을 스트림으로 처리
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream);
  } catch (error: any) {
    console.error('Chat API 에러:', error);
    return new Response(
      JSON.stringify({ 
        error: '채팅 처리 중 오류가 발생했습니다.', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
} 