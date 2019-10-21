import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Permission } from 'accesscontrol';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppLogger } from '..';

/**
 * Interceptor that automatically filter response attributes based on access control
 * permissions.
 */
@Injectable()
export class AccessControlResponseInterceptor implements NestInterceptor {

    private logger = new AppLogger(AccessControlResponseInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { permissions } = context.switchToHttp().getRequest();

        return next.handle().pipe(
            map((data: any) => {

                if (!permissions) {
                    return data;
                }

                return permissions.reduce((acc: any, permission: Permission) => {
                    return permission.filter(acc);
                }, data);
            })
        );
    }
}
