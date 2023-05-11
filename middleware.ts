import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// logger.js
class Logger {
  static log(message: string) {
    console.log(new Date().toLocaleTimeString() + ": " + message);
  }
}

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  NextResponse.next();
  Logger.log(`${req.method} ${getPathFromUrl(req.url)}`);
}


const getPathFromUrl = (url: string) => {
  try {
    const Url = new URL(url);
    return Url.pathname
  } catch (e: any) {
    return ''
  }
}


