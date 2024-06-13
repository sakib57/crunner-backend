import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    status: string;
    data: T;
    message: string;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map((res) => {
                const result = res && res.hasOwnProperty('data') ? res.data : res;
                const pagination =
                    res && res.hasOwnProperty('pagination') ? res.pagination : null;
                const message = res && res.hasOwnProperty('message') ? res.message : '';
                return {
                    status: 'SUCCESS',
                    data: result || '',
                    message: message,
                    pagination,
                };
            }),
        );
    }
}
