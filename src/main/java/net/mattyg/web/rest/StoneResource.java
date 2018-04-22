package net.mattyg.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.mattyg.domain.Stone;

import net.mattyg.repository.StoneRepository;
import net.mattyg.web.rest.errors.BadRequestAlertException;
import net.mattyg.web.rest.util.HeaderUtil;
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
 * REST controller for managing Stone.
 */
@RestController
@RequestMapping("/api")
public class StoneResource {

    private final Logger log = LoggerFactory.getLogger(StoneResource.class);

    private static final String ENTITY_NAME = "stone";

    private final StoneRepository stoneRepository;

    public StoneResource(StoneRepository stoneRepository) {
        this.stoneRepository = stoneRepository;
    }

    /**
     * POST  /stones : Create a new stone.
     *
     * @param stone the stone to create
     * @return the ResponseEntity with status 201 (Created) and with body the new stone, or with status 400 (Bad Request) if the stone has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/stones")
    @Timed
    public ResponseEntity<Stone> createStone(@Valid @RequestBody Stone stone) throws URISyntaxException {
        log.debug("REST request to save Stone : {}", stone);
        if (stone.getId() != null) {
            throw new BadRequestAlertException("A new stone cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Stone result = stoneRepository.save(stone);
        return ResponseEntity.created(new URI("/api/stones/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /stones : Updates an existing stone.
     *
     * @param stone the stone to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated stone,
     * or with status 400 (Bad Request) if the stone is not valid,
     * or with status 500 (Internal Server Error) if the stone couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/stones")
    @Timed
    public ResponseEntity<Stone> updateStone(@Valid @RequestBody Stone stone) throws URISyntaxException {
        log.debug("REST request to update Stone : {}", stone);
        if (stone.getId() == null) {
            return createStone(stone);
        }
        Stone result = stoneRepository.save(stone);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, stone.getId().toString()))
            .body(result);
    }

    /**
     * GET  /stones : get all the stones.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of stones in body
     */
    @GetMapping("/stones")
    @Timed
    public List<Stone> getAllStones() {
        log.debug("REST request to get all Stones");
        return stoneRepository.findAll();
        }

    /**
     * GET  /stones/:id : get the "id" stone.
     *
     * @param id the id of the stone to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the stone, or with status 404 (Not Found)
     */
    @GetMapping("/stones/{id}")
    @Timed
    public ResponseEntity<Stone> getStone(@PathVariable Long id) {
        log.debug("REST request to get Stone : {}", id);
        Stone stone = stoneRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(stone));
    }

    /**
     * DELETE  /stones/:id : delete the "id" stone.
     *
     * @param id the id of the stone to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/stones/{id}")
    @Timed
    public ResponseEntity<Void> deleteStone(@PathVariable Long id) {
        log.debug("REST request to delete Stone : {}", id);
        stoneRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
