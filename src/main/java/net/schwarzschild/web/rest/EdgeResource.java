package net.schwarzschild.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.schwarzschild.domain.Edge;

import net.schwarzschild.repository.EdgeRepository;
import net.schwarzschild.web.rest.errors.BadRequestAlertException;
import net.schwarzschild.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Edge.
 */
@RestController
@RequestMapping("/api")
public class EdgeResource {

    private final Logger log = LoggerFactory.getLogger(EdgeResource.class);

    private static final String ENTITY_NAME = "edge";

    private final EdgeRepository edgeRepository;

    public EdgeResource(EdgeRepository edgeRepository) {
        this.edgeRepository = edgeRepository;
    }

    /**
     * POST  /edges : Create a new edge.
     *
     * @param edge the edge to create
     * @return the ResponseEntity with status 201 (Created) and with body the new edge, or with status 400 (Bad Request) if the edge has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/edges")
    @Timed
    public ResponseEntity<Edge> createEdge(@Valid @RequestBody Edge edge) throws URISyntaxException {
        log.debug("REST request to save Edge : {}", edge);
        if (edge.getId() != null) {
            throw new BadRequestAlertException("A new edge cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Edge result = edgeRepository.save(edge);
        return ResponseEntity.created(new URI("/api/edges/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /edges : Updates an existing edge.
     *
     * @param edge the edge to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated edge,
     * or with status 400 (Bad Request) if the edge is not valid,
     * or with status 500 (Internal Server Error) if the edge couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/edges")
    @Timed
    public ResponseEntity<Edge> updateEdge(@Valid @RequestBody Edge edge) throws URISyntaxException {
        log.debug("REST request to update Edge : {}", edge);
        if (edge.getId() == null) {
            return createEdge(edge);
        }
        Edge result = edgeRepository.save(edge);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, edge.getId().toString()))
            .body(result);
    }

    /**
     * GET  /edges : get all the edges.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of edges in body
     */
    @GetMapping("/edges")
    @Timed
    public List<Edge> getAllEdges() {
        log.debug("REST request to get all Edges");
        return edgeRepository.findAll();
        }

    /**
     * GET  /edges/:id : get the "id" edge.
     *
     * @param id the id of the edge to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the edge, or with status 404 (Not Found)
     */
    @GetMapping("/edges/{id}")
    @Timed
    public ResponseEntity<Edge> getEdge(@PathVariable Long id) {
        log.debug("REST request to get Edge : {}", id);
        Edge edge = edgeRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(edge));
    }

    /**
     * DELETE  /edges/:id : delete the "id" edge.
     *
     * @param id the id of the edge to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/edges/{id}")
    @Timed
    public ResponseEntity<Void> deleteEdge(@PathVariable Long id) {
        log.debug("REST request to delete Edge : {}", id);
        edgeRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
