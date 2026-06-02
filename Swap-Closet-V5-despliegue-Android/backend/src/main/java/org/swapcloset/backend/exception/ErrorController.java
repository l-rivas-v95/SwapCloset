package org.swapcloset.backend.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ErrorController{

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> controladorErrores(MethodArgumentNotValidException exception){

        Map<String, String> mapaErrores = new HashMap<>();

        for(FieldError error : exception.getBindingResult().getFieldErrors()){
            mapaErrores.put(error.getField(), error.getDefaultMessage());
        }
        return new ResponseEntity<>(mapaErrores, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(
            ResponseStatusException ex) {

        Map<String, String> error = new HashMap<>();
        error.put("error", "Fallo de Lógica de Negocio/Recurso");
        error.put("message", ex.getReason());
        error.put("status", String.valueOf(ex.getStatusCode().value()));

        return ResponseEntity.status(ex.getStatusCode()).body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, String>> handleDataIntegrity(
            DataIntegrityViolationException ex) {

        Map<String, String> error = new HashMap<>();

        error.put("error", "Datos inválidos en la base de datos");
        error.put("message", "Fallo de integridad: Hay campos obligatorios que no pueden ser nulos o hay datos duplicados.");

        return ResponseEntity.badRequest().body(error);
    }

}
