import { UsuarioDTO } from './UsuarioDTO';

export interface LoginResponseDTO {
  token: string;
  usuario: UsuarioDTO;
}
