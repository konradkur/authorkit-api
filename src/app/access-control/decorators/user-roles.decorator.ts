import { createParamDecorator } from '@nestjs/common';

/**
 * Access the user roles from the request object i.e `req.user.roles`.
 */
export const UserRoles = createParamDecorator((data: string, req) => {
  return data ? req.user[data] : req.user.roles;
});
