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
import {AnuncioPrestamoPage} from "./pages/anuncio-prestamo/anuncio-prestamo.page";
import {AnuncioIntercambioPage} from "./pages/anuncio-intercambio/anuncio-intercambio.page";
import {PerfilOtroPage} from "./pages/perfil-otro/perfil-otro.page";

export const routes: Routes = [

  {path: '', redirectTo: 'animacion-inicio', pathMatch: 'full',},
  {path: 'home', component: HomePage},
  {path: 'explorar', component: ExplorarPage},
  {path: 'publicar', component: PublicarPage},
  {path: 'chat', component: ChatPage},
  {path: 'perfil', component: PerfilPage},
  {path: 'anuncio', component: AnuncioPage},
  {path: 'publicaciones-pasadas/:id', component: PublicacionesPasadasPage},
  {path: 'favoritos/:id', component: FavoritosPage},
  {path: 'seguidores/:id', component: SeguidoresPage},
  {path: 'publicaciones-activas/:id', component: PublicacionesActivasPage},
  {path: 'login', component: LoginPage},
  {path: 'registro', component: RegistroPage},
  {path: 'animacion-inicio',component: AnimacionInicioPage},
  {path: 'mensajes', component: MensajesPage},
  {path: 'anuncio-prestamo/:id', component: AnuncioPrestamoPage},
  {path: 'anuncio-intercambio/:id', component: AnuncioIntercambioPage},
  {path: 'perfil-otro/:id', component: PerfilOtroPage}

];
