package org.swapcloset.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
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

        Object publicId = resultado.get("public_id");
        if (publicId == null) {
            throw new IOException("Cloudinary no devolvió public_id");
        }

        return cloudinary.url()
                .secure(true)
                .transformation(new Transformation<>()
                        .width(900)
                        .height(900)
                        .crop("fill")
                        .gravity("auto")
                        .quality("auto")
                        .fetchFormat("auto"))
                .generate(publicId.toString());
    }

    private void validarImagen(MultipartFile archivo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new IOException("El archivo está vacío");
        }

        String contentType = archivo.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IOException("El archivo debe ser una imagen");
        }

        long maxBytes = 5L * 1024L * 1024L;
        if (archivo.getSize() > maxBytes) {
            throw new IOException("La imagen no puede superar 5 MB");
        }
    }
}
