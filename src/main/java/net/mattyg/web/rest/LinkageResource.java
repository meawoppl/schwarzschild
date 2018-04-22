package net.mattyg.web.rest;

import com.codahale.metrics.annotation.Timed;
import net.mattyg.domain.Linkage;

import net.mattyg.repository.LinkageRepository;
import net.mattyg.web.rest.errors.BadRequestAlertException;
import net.mattyg.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Linkage.
 */
@RestController
@RequestMapping("/api")
public class LinkageResource {

    private final Logger log = LoggerFactory.getLogger(LinkageResource.class);

    private static final String ENTITY_NAME = "linkage";

    private final LinkageRepository linkageRepository;

    public LinkageResource(LinkageRepository linkageRepository) {
        this.linkageRepository = linkageRepository;
    }

    /**
     * POST  /linkages : Create a new linkage.
     *
     * @param linkage the linkage to create
     * @return the ResponseEntity with status 201 (Created) and with body the new linkage, or with status 400 (Bad Request) if the linkage has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/linkages")
    @Timed
    public ResponseEntity<Linkage> createLinkage(@RequestBody Linkage linkage) throws URISyntaxException {
        log.debug("REST request to save Linkage : {}", linkage);
        if (linkage.getId() != null) {
            throw new BadRequestAlertException("A new linkage cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Linkage result = linkageRepository.save(linkage);
        return ResponseEntity.created(new URI("/api/linkages/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /linkages : Updates an existing linkage.
     *
     * @param linkage the linkage to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated linkage,
     * or with status 400 (Bad Request) if the linkage is not valid,
     * or with status 500 (Internal Server Error) if the linkage couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/linkages")
    @Timed
    public ResponseEntity<Linkage> updateLinkage(@RequestBody Linkage linkage) throws URISyntaxException {
        log.debug("REST request to update Linkage : {}", linkage);
        if (linkage.getId() == null) {
            return createLinkage(linkage);
        }
        Linkage result = linkageRepository.save(linkage);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, linkage.getId().toString()))
            .body(result);
    }

    /**
     * GET  /linkages : get all the linkages.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of linkages in body
     */
    @GetMapping("/linkages")
    @Timed
    public List<Linkage> getAllLinkages() {
        log.debug("REST request to get all Linkages");
        return linkageRepository.findAll();
        }

    /**
     * GET  /linkages/:id : get the "id" linkage.
     *
     * @param id the id of the linkage to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the linkage, or with status 404 (Not Found)
     */
    @GetMapping("/linkages/{id}")
    @Timed
    public ResponseEntity<Linkage> getLinkage(@PathVariable Long id) {
        log.debug("REST request to get Linkage : {}", id);
        Linkage linkage = linkageRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(linkage));
    }

    /**
     * DELETE  /linkages/:id : delete the "id" linkage.
     *
     * @param id the id of the linkage to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/linkages/{id}")
    @Timed
    public ResponseEntity<Void> deleteLinkage(@PathVariable Long id) {
        log.debug("REST request to delete Linkage : {}", id);
        linkageRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
