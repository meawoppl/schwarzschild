package net.schwarzschild.web.rest;

import net.schwarzschild.SchwarzschildApp;

import net.schwarzschild.domain.Edge;
import net.schwarzschild.domain.Stone;
import net.schwarzschild.domain.Stone;
import net.schwarzschild.repository.EdgeRepository;
import net.schwarzschild.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.List;

import static net.schwarzschild.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EdgeResource REST controller.
 *
 * @see EdgeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SchwarzschildApp.class)
public class EdgeResourceIntTest {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private EdgeRepository edgeRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEdgeMockMvc;

    private Edge edge;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EdgeResource edgeResource = new EdgeResource(edgeRepository);
        this.restEdgeMockMvc = MockMvcBuilders.standaloneSetup(edgeResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Edge createEntity(EntityManager em) {
        Edge edge = new Edge()
            .description(DEFAULT_DESCRIPTION);
        // Add required entity
        Stone from = StoneResourceIntTest.createEntity(em);
        em.persist(from);
        em.flush();
        edge.setFrom(from);
        // Add required entity
        Stone to = StoneResourceIntTest.createEntity(em);
        em.persist(to);
        em.flush();
        edge.setTo(to);
        return edge;
    }

    @Before
    public void initTest() {
        edge = createEntity(em);
    }

    @Test
    @Transactional
    public void createEdge() throws Exception {
        int databaseSizeBeforeCreate = edgeRepository.findAll().size();

        // Create the Edge
        restEdgeMockMvc.perform(post("/api/edges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(edge)))
            .andExpect(status().isCreated());

        // Validate the Edge in the database
        List<Edge> edgeList = edgeRepository.findAll();
        assertThat(edgeList).hasSize(databaseSizeBeforeCreate + 1);
        Edge testEdge = edgeList.get(edgeList.size() - 1);
        assertThat(testEdge.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createEdgeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = edgeRepository.findAll().size();

        // Create the Edge with an existing ID
        edge.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEdgeMockMvc.perform(post("/api/edges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(edge)))
            .andExpect(status().isBadRequest());

        // Validate the Edge in the database
        List<Edge> edgeList = edgeRepository.findAll();
        assertThat(edgeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = edgeRepository.findAll().size();
        // set the field null
        edge.setDescription(null);

        // Create the Edge, which fails.

        restEdgeMockMvc.perform(post("/api/edges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(edge)))
            .andExpect(status().isBadRequest());

        List<Edge> edgeList = edgeRepository.findAll();
        assertThat(edgeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEdges() throws Exception {
        // Initialize the database
        edgeRepository.saveAndFlush(edge);

        // Get all the edgeList
        restEdgeMockMvc.perform(get("/api/edges?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(edge.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getEdge() throws Exception {
        // Initialize the database
        edgeRepository.saveAndFlush(edge);

        // Get the edge
        restEdgeMockMvc.perform(get("/api/edges/{id}", edge.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(edge.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEdge() throws Exception {
        // Get the edge
        restEdgeMockMvc.perform(get("/api/edges/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEdge() throws Exception {
        // Initialize the database
        edgeRepository.saveAndFlush(edge);
        int databaseSizeBeforeUpdate = edgeRepository.findAll().size();

        // Update the edge
        Edge updatedEdge = edgeRepository.findOne(edge.getId());
        // Disconnect from session so that the updates on updatedEdge are not directly saved in db
        em.detach(updatedEdge);
        updatedEdge
            .description(UPDATED_DESCRIPTION);

        restEdgeMockMvc.perform(put("/api/edges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEdge)))
            .andExpect(status().isOk());

        // Validate the Edge in the database
        List<Edge> edgeList = edgeRepository.findAll();
        assertThat(edgeList).hasSize(databaseSizeBeforeUpdate);
        Edge testEdge = edgeList.get(edgeList.size() - 1);
        assertThat(testEdge.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingEdge() throws Exception {
        int databaseSizeBeforeUpdate = edgeRepository.findAll().size();

        // Create the Edge

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEdgeMockMvc.perform(put("/api/edges")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(edge)))
            .andExpect(status().isCreated());

        // Validate the Edge in the database
        List<Edge> edgeList = edgeRepository.findAll();
        assertThat(edgeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEdge() throws Exception {
        // Initialize the database
        edgeRepository.saveAndFlush(edge);
        int databaseSizeBeforeDelete = edgeRepository.findAll().size();

        // Get the edge
        restEdgeMockMvc.perform(delete("/api/edges/{id}", edge.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Edge> edgeList = edgeRepository.findAll();
        assertThat(edgeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Edge.class);
        Edge edge1 = new Edge();
        edge1.setId(1L);
        Edge edge2 = new Edge();
        edge2.setId(edge1.getId());
        assertThat(edge1).isEqualTo(edge2);
        edge2.setId(2L);
        assertThat(edge1).isNotEqualTo(edge2);
        edge1.setId(null);
        assertThat(edge1).isNotEqualTo(edge2);
    }
}
