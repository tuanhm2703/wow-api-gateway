import { SetMetadata } from '@nestjs/common';

export const ApiPermissions = (...permissions: number[]) => {
  if (Array.isArray(permissions)) {
    return SetMetadata('permission', permissions);
  }
};
