import { z } from 'zod';
import {
  createUserSchema,
  updateUserSchema,
  loginSchema,
  userResponseSchema,
} from '../schemas/user.schema.js';

export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
export type UserResponseDTO = z.infer<typeof userResponseSchema>;

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token: string;
}
