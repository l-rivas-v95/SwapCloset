package org.swapcloset.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String subirImagen(MultipartFile archivo, String carpeta) throws IOException {
        validarImagen(archivo);

        Map<?, ?> resultado = cloudinary.uploader().upload(
                archivo.getBytes(),
                ObjectUtils.asMap(
                        "folder", carpeta,
                        "resource_type", "image"
                )
        );

        Object secureUrl = resultado.get("secure_url");
        if (secureUrl == null) {
            throw new IOException("Cloudinary no devolvió secure_url");
        }

        return aplicarTransformacionProducto(secureUrl.toString());
    }

    public String subirImagenPerfil(MultipartFile archivo) throws IOException {
        validarImagen(archivo);

        Map<?, ?> resultado = cloudinary.uploader().upload(
                archivo.getBytes(),
                ObjectUtils.asMap(
                        "folder", "swapcloset/perfiles",
                        "resource_type", "image"
                )
        );

        Object secureUrl = resultado.get("secure_url");
        if (secureUrl == null) {
            throw new IOException("Cloudinary no devolvió secure_url");
        }

        return aplicarTransformacionPerfil(secureUrl.toString());
    }

    private String aplicarTransformacionProducto(String urlOriginal) {
        return urlOriginal.replace(
                "/image/upload/",
                "/image/upload/c_fill,g_auto,h_900,w_900,q_auto,f_auto/"
        );
    }

    private String aplicarTransformacionPerfil(String urlOriginal) {
        return urlOriginal.replace(
                "/image/upload/",
                "/image/upload/c_fill,g_auto,h_500,w_500,q_auto,f_auto/"
        );
    }

    private void validarImagen(MultipartFile archivo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new IOException("El archivo está vacío");
        }

        String contentType = archivo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("El archivo debe ser una imagen");
        }

        long maxBytes = 15L * 1024L * 1024L;
        if (archivo.getSize() > maxBytes) {
            throw new IOException("La imagen no puede superar 15 MB");
        }
    }
}
