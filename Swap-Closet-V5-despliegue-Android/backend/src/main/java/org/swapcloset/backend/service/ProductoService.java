package org.swapcloset.backend.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.swapcloset.backend.converter.ProductoMapper;
import org.swapcloset.backend.dto.CartaProductoDTO;
import org.swapcloset.backend.dto.CartaProductoIntercambioDTO;
import org.swapcloset.backend.dto.ProductoDTO;
import org.swapcloset.backend.modelos.ImagenProducto;
import org.swapcloset.backend.modelos.Producto;
import org.swapcloset.backend.modelos.TipoProducto;
import org.swapcloset.backend.modelos.Usuario;
import org.swapcloset.backend.repository.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoMapper productoMapper;
    private final EntityManager em;
    private final RaitingService raitingService;
    private final ImagenProductoService imagenProductoService;
    private final ChatService chatService;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<ProductoDTO> findAll() {
        return productoRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Producto::getFechaCreacion, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Transactional(readOnly = true)
    public CartaProductoDTO getCartaProductoDTOidProducto(Integer idProducto){

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        Producto producto = productoRepository.findById(idProducto).orElseThrow(() ->
                new IllegalArgumentException("Producto no encontrado"));
        Usuario usuario = producto.getUsuario();
        String imagenUrl = imagenProductoService.getPrimeraImagen(idProducto);
        Double raiting = raitingService.obtenerMediaPuntuacionUsuario(usuario.getId());

        CartaProductoDTO dto = new CartaProductoDTO();
        BigDecimal precio = producto.getPrecio();

        // Producto
        dto.setProductoId(producto.getId());
        dto.setTipo(producto.getTipo().toString());
        dto.setPrecio(precio != null ? productoMapper.convertBigDecimalToString(precio) : null);
        dto.setTitulo(producto.getTitulo());
        dto.setEstado(producto.getEstado());
        dto.setTalla(producto.getTalla());
        dto.setCategoria(producto.getCategoria());

        // Formateo de fechas
        dto.setFechaDevolucion(producto.getFechaDevolucion() != null ?
                producto.getFechaDevolucion().format(formatter) : null);
        dto.setFechaCreacion(producto.getFechaCreacion() != null ?
                producto.getFechaCreacion().format(formatter) : null);

        dto.setActivo(producto.getActivo());

        // Imagen Producto
        dto.setUrlImgProducto(imagenUrl);

        // Usuario
        dto.setUsuarioId(usuario.getId());
        dto.setNombreUsuario(usuario.getNombre());
        dto.setApellidosUsuario(usuario.getApellidos());
        dto.setUrlImgUsuario(usuario.getUrlImg());
        dto.setUbicacionUsuario(usuario.getDireccion());

        // Raiting
        dto.setRaiting(raiting);

        return dto;
    }

    @Transactional(readOnly = true)
    public List<CartaProductoDTO> getAllCartasProductosDTOActivos() {
        return productoRepository.findByActivoTrueOrderByIdDesc()
                .stream()
                .map(producto -> getCartaProductoDTOidProducto(producto.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CartaProductoIntercambioDTO getCartaProductoIntercambioDTOidProducto(Integer idProducto){

        // Obtenemos los datos básicos usando el método existente
        ProductoDTO productoDTO = productoRepository.findById(idProducto)
                .map(productoMapper::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));

        // Creamos el DTO de intercambio
        CartaProductoIntercambioDTO dto = new CartaProductoIntercambioDTO();

        // Copiamos los datos comunes del DTO base
        dto.setId(productoDTO.getId());
        dto.setTipo(productoDTO.getTipo());
        dto.setPrecio(productoDTO.getPrecio());
        dto.setTitulo(productoDTO.getTitulo());
        dto.setEstado(productoDTO.getEstado());
        dto.setEstilo(productoDTO.getEstilo());
        dto.setDescripcion(productoDTO.getDescripcion());
        dto.setMarca(productoDTO.getMarca());
        dto.setCategoria(productoDTO.getCategoria());
        dto.setTalla(productoDTO.getTalla());
        dto.setColor(productoDTO.getColor());
        dto.setFechaDevolucion(productoDTO.getFechaDevolucion());
        dto.setFechaCreacion(productoDTO.getFechaCreacion());
        dto.setIdUsuario(productoDTO.getIdUsuario());
        dto.setActivo(productoDTO.getActivo());

        // Agregamos el campo específico de intercambio
        dto.setIntercambios(chatService.getCantidadTotalIntercambiosPorProducto(idProducto));

        return dto;
    }

    @Transactional(readOnly = true)
    public List<CartaProductoIntercambioDTO> getTodasCartasProductosIntercambioActivos() {
        return productoRepository.findByActivoTrueOrderByFechaCreacionDesc()
                .stream()
                .map(producto -> getCartaProductoIntercambioDTOidProducto(producto.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CartaProductoIntercambioDTO> getTop5ProductosConMasIntercambios() {
        return productoRepository.topProductosConMasIntercambios(PageRequest.of(0, 5));
    }

    @Transactional(readOnly = true)
    public List<CartaProductoIntercambioDTO> getTop5ProductosConMasIntercambiosActivos() {
        return productoRepository.findByActivoTrue()
                .stream()
                .map(producto -> getCartaProductoIntercambioDTOidProducto(producto.getId()))
                .sorted(Comparator.comparingInt(CartaProductoIntercambioDTO::getIntercambios).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> filtrar(String categoria, String talla, String estado) {

        boolean hasCategoria = categoria != null && !categoria.isBlank();
        boolean hasTalla = talla != null && !talla.isBlank();
        boolean hasEstado = estado != null && !estado.isBlank();

        List<Producto> productos;

        // 3 filtros
        if (hasCategoria && hasTalla && hasEstado) {
            productos = productoRepository.findByCategoriaAndTallaAndEstadoAndActivoTrue(
                    categoria, talla, estado
            );
        }
        // 2 filtros
        else if (hasCategoria && hasTalla) {
            productos = productoRepository.findByCategoriaAndTallaAndActivoTrue(categoria, talla);
        }
        else if (hasCategoria && hasEstado) {
            productos = productoRepository.findByCategoriaAndEstadoAndActivoTrue(categoria, estado);
        }
        else if (hasTalla && hasEstado) {
            productos = productoRepository.findByTallaAndEstadoAndActivoTrue(talla, estado);
        }
        // 1 filtro
        else if (hasCategoria) {
            productos = productoRepository.findByCategoriaAndActivoTrue(categoria);
        }
        else if (hasTalla) {
            productos = productoRepository.findByTallaAndActivoTrue(talla);
        }
        else if (hasEstado) {
            productos = productoRepository.findByEstadoAndActivoTrue(estado);
        }
        // Sin filtros → todos los activos
        else {
            productos = productoRepository.findByActivoTrue();
        }

        return productos.stream()
                .sorted(Comparator.comparing(Producto::getFechaCreacion, Comparator.nullsLast(Comparator.reverseOrder())))
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CartaProductoDTO> getCartasProductosDTOByUsuarioIdAndActivo(Integer usuarioId) {
        return productoRepository.findAllByUsuarioAndActivo(usuarioId)
                .stream()
                .map(producto -> getCartaProductoDTOidProducto(producto.getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> getProductosPorUsuarioId(Integer usuarioId) {
        return productoMapper.toDTOsList(productoRepository.findByUsuarioIdOrderByFechaCreacionDesc(usuarioId));
    }

    @Transactional(readOnly = true)
    public Optional<ProductoDTO> findById(Integer id) {
        return productoRepository.findById(id).map(productoMapper::toDTO);
    }

    @Transactional
    public ProductoDTO save(ProductoDTO productoDTO) {

        // 1. Regla de negocio: usuario debe existir
        if (!usuarioRepository.existsById(productoDTO.getIdUsuario())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No existe el id de usuario"
            );
        }

        if((productoDTO.getTipo().equals("intercambio") || productoDTO.getTipo().equals("Intercambio")) && productoDTO.getPrecio() != null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los productos de tipo Intercambio no deben tener precio"
            );
        }

        if((productoDTO.getTipo().equals("prestamo") || productoDTO.getTipo().equals("Préstamo") || productoDTO.getTipo().equals("Prestamo")) && productoDTO.getPrecio() == null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los productos de tipo Préstamo deben tener precio"
            );
        }


        Producto entidad = productoMapper.toEntity(productoDTO);

        Usuario usuarioRef = em.getReference(
                Usuario.class,
                productoDTO.getIdUsuario()
        );
        entidad.setUsuario(usuarioRef);

        if (entidad.getImagenes() != null) {
            entidad.getImagenes()
                    .forEach(img -> img.setProducto(entidad));
        }

        Producto saved = productoRepository.save(entidad);

        return productoMapper.toDTO(saved);
    }


    @Transactional
    public ProductoDTO update(ProductoDTO productoDTO) {

        if (!productoRepository.existsById(productoDTO.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No existe Producto con id: " + productoDTO.getId()
            );
        }

        if (!usuarioRepository.existsById(productoDTO.getIdUsuario())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No existe el id de usuario"
            );
        }

        if((productoDTO.getTipo().equals("intercambio") || productoDTO.getTipo().equals("Intercambio")) && productoDTO.getPrecio() != null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los productos de tipo Intercambio no deben tener precio"
            );
        }

        if((productoDTO.getTipo().equals("prestamo") || productoDTO.getTipo().equals("Préstamo") || productoDTO.getTipo().equals("Prestamo")) && productoDTO.getPrecio() == null){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los productos de tipo Préstamo deben tener precio"
            );
        }

        if(!productoDTO.getTipo().equalsIgnoreCase("intercambio") && !productoDTO.getTipo().equalsIgnoreCase("prestamo") && !productoDTO.getTipo().equalsIgnoreCase("préstamo")){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El tipo de producto debe ser 'Intercambio' o 'Préstamo'"
            );
        }

        Producto entidad = productoMapper.toEntity(productoDTO);

        Usuario usuarioRef = em.getReference(
                Usuario.class, productoDTO.getIdUsuario()
        );
        entidad.setUsuario(usuarioRef);

        if (entidad.getImagenes() != null) {
            entidad.getImagenes()
                    .forEach(img -> img.setProducto(entidad));
        }

        Producto updated = productoRepository.save(entidad);
        return productoMapper.toDTO(updated);
    }


    @Transactional
    public void deleteById(Integer id) {
        if (id == null) return;
        productoRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findByCategoria(String categoria) {
        return productoRepository.findByCategoria(categoria)
                .stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findByMarca(String marca) {
        return productoRepository.findByMarca(marca)
                .stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findByTalla(String talla) {
        return productoRepository.findByTalla(talla)
                .stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findByTipo(org.swapcloset.backend.modelos.TipoProducto tipo) {
        return productoRepository.findByTipo(tipo)
                .stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findByPrecioRange(BigDecimal min, BigDecimal max) {
        return productoRepository.findByPrecioBetween(min, max)
                .stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> searchByTitulo(String titulo) {
        return productoRepository.findByTituloContainingIgnoreCase(titulo)
                .stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findAvailableProducts() {
        return productoMapper.toDTOsList(productoRepository.findByActivoTrueOrderByFechaCreacionDesc());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findByColor(String color) {
        return productoRepository.findByColor(color)
                .stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> findProductsDueForReturn(LocalDateTime fechaLimite) {
        return productoRepository.findByFechaDevolucionBefore(fechaLimite)
                .stream()
                .map(productoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean existsById(Integer id) {
        return id != null && productoRepository.existsById(id);
    }

    @Transactional(readOnly = true)
    public Page<ProductoDTO> findActivePage(Pageable pageable) {
        return productoRepository.findByActivoTrue(pageable)
                .map(productoMapper::toDTO);
    }

}
