import { NextRequest } from 'next/server';
import { Message as AIMessage } from 'ai';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// 로그 파일에 기록하는 함수 추가
const logToFile = (message: string) => {
  try {
    const logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logPath = path.join(logDir, 'api-log.txt');
    fs.appendFileSync(logPath, `${new Date().toISOString()}: ${message}\n`);
  } catch (error) {
    console.error('로그 파일 작성 실패:', error);
  }
};

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// 시스템 프롬프트 설정
const systemPrompt = `당신은 도움이 되는 AI 비서입니다. 사용자의 질문에 친절하고 정확하게 답변해 주세요.
가능한 한 간결하게 답변하되, 중요한 정보는 누락하지 마세요.
한국어로 대화를 진행합니다.
한국어로 질문하면 무조건 한국어로 답변하세요.
영어로 질문하면 영어로 답변하세요.
질문의 언어와 동일한 언어로 답변하는 것이 가장 중요합니다.`;

export async function POST(req: NextRequest) {
  try {
    // 요청 Content-Type 확인 및 로깅
    const contentType = req.headers.get('Content-Type') || '';
    console.log('요청 Content-Type:', contentType);

    // 요청에서 메시지 추출
    const data = await req.json();
    const { messages } = data;
    
    // 로그 파일에 요청 메시지 기록
    logToFile(`요청 메시지: ${JSON.stringify(messages)}`);

    // 메시지 유효성 검사
    if (!messages || !Array.isArray(messages)) {
      return new Response('메시지가 유효하지 않습니다.', { 
        status: 400,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    // 첫 번째 사용자 메시지 로깅
    const userMessage = messages.find(m => m.role === 'user');
    if (userMessage) {
      logToFile(`사용자 메시지: ${userMessage.content}`);
    }

    // 시스템 메시지가 이미 있는지 확인
    const hasSystemMessage = messages.some(m => m.role === 'system');
    
    // API 호출을 위한 메시지 준비
    const apiMessages = hasSystemMessage 
      ? messages 
      : [{ role: 'system', content: systemPrompt }, ...messages];

    // OpenAI API 호출
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // 응답 스트림 생성
    const encoder = new TextEncoder();
    const decoder = new TextDecoder('utf-8');
    
    let counter = 0;
    
    const stream = new ReadableStream({
      async start(controller) {
        let aiResponse = '';
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            aiResponse += content;
            controller.enqueue(encoder.encode(content));
          }
        }
        
        // 완성된 AI 응답을 파일에 로깅
        logToFile(`AI 응답: ${aiResponse}`);
        controller.close();
      },
    });

    // UTF-8 인코딩 명시적 설정
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: any) {
    console.error('Chat API 에러:', error);
    logToFile(`에러: ${error.message}`);
    
    return new Response(
      JSON.stringify({ 
        error: '채팅 처리 중 오류가 발생했습니다.', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json; charset=utf-8' 
        } 
      }
    );
  }
} 