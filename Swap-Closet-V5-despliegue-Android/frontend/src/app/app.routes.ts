import { Routes } from '@angular/router';
import {HomePage} from "./pages/home/home.page";
import {ExplorarPage} from "./pages/explorar/explorar.page";
import {PublicarPage} from "./pages/publicar/publicar.page";
import {ChatPage} from "./pages/chat/chat.page";
import {PerfilPage} from "./pages/perfil/perfil.page";
import {AnuncioPage} from "./pages/anuncio/anuncio.page";
import {PublicacionesPasadasPage} from "./pages/publicaciones-pasadas/publicaciones-pasadas.page";
import {FavoritosPage} from "./pages/favoritos/favoritos.page";
import {SeguidoresPage} from "./pages/seguidores/seguidores.page";
import {PublicacionesActivasPage} from "./pages/publicaciones-activas/publicaciones-activas.page";
import {LoginPage} from "./pages/login/login.page";
import {RegistroPage} from "./pages/registro/registro.page";
import {AnimacionInicioPage} from "./pages/animacion-inicio/animacion-inicio.page";
import {MensajesPage} from "./pages/mensajes/mensajes.page";
import {ConfirmacionIntercambioPage} from "./pages/confirmacion-intercambio/confirmacion-intercambio.page";
import {TestModalPage} from "./pages/test-modal/test-modal.page";

export const routes: Routes = [
  {path: '', redirectTo: 'animacion-inicio', pathMatch: 'full'},
  {path: 'home', component: HomePage},
  {path: 'explorar', component: ExplorarPage},
  {path: 'publicar', component: PublicarPage},
  {path: 'chat', component: ChatPage},
  {path: 'perfil', component: PerfilPage},
  {path: 'perfil/:id', component: PerfilPage},
  {path: 'anuncio/:id', component: AnuncioPage},
  {path: 'anuncio', redirectTo: 'home', pathMatch: 'full'},
  {path: 'publicaciones-pasadas/:id', component: PublicacionesPasadasPage},
  {path: 'favoritos/:id', component: FavoritosPage},
  {path: 'seguidores/:id', component: SeguidoresPage},
  {path: 'publicaciones-activas/:id', component: PublicacionesActivasPage},
  {path: 'login', component: LoginPage},
  {path: 'registro', component: RegistroPage},
  {path: 'animacion-inicio', component: AnimacionInicioPage},
  {path: 'mensajes/:id', component: MensajesPage},
  {path: 'mensajes', redirectTo: 'chat', pathMatch: 'full'},
  {path: 'confirmacion-intercambio/:id', component: ConfirmacionIntercambioPage},
  {path: 'anuncio-prestamo/:id', redirectTo: 'anuncio/:id', pathMatch: 'full'},
  {path: 'anuncio-intercambio/:id', redirectTo: 'anuncio/:id', pathMatch: 'full'},
  {path: 'perfil-otro/:id', redirectTo: 'perfil/:id', pathMatch: 'full'},
  {path: 'test-modal', component: TestModalPage}
];
