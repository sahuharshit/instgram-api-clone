import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const SKIP_INTERCEPTOR = 'skipInterceptor';
export const SkipInterceptor = () => SetMetadata(SKIP_INTERCEPTOR, true);
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
