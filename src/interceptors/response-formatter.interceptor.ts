import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IdentitySchema } from 'src/schemas/identity-schema';

@Injectable()
export class ResponseFormatterInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (response instanceof IdentitySchema) {
          return response.formatResponse();
        }

        if (Array.isArray(response)) {
          return response.map((item) => {
            if (item instanceof IdentitySchema) {
              return item.formatResponse();
            }
            return item;
          });
        }

        return response;
      }),
    );
  }
}
