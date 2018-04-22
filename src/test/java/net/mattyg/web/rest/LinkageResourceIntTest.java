package net.mattyg.web.rest;

import net.mattyg.SchwarzschildApp;

import net.mattyg.domain.Linkage;
import net.mattyg.repository.LinkageRepository;
import net.mattyg.web.rest.errors.ExceptionTranslator;

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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static net.mattyg.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the LinkageResource REST controller.
 *
 * @see LinkageResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SchwarzschildApp.class)
public class LinkageResourceIntTest {

    private static final Instant DEFAULT_CREATION_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATION_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private LinkageRepository linkageRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restLinkageMockMvc;

    private Linkage linkage;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final LinkageResource linkageResource = new LinkageResource(linkageRepository);
        this.restLinkageMockMvc = MockMvcBuilders.standaloneSetup(linkageResource)
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
    public static Linkage createEntity(EntityManager em) {
        Linkage linkage = new Linkage()
            .creationTime(DEFAULT_CREATION_TIME);
        return linkage;
    }

    @Before
    public void initTest() {
        linkage = createEntity(em);
    }

    @Test
    @Transactional
    public void createLinkage() throws Exception {
        int databaseSizeBeforeCreate = linkageRepository.findAll().size();

        // Create the Linkage
        restLinkageMockMvc.perform(post("/api/linkages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(linkage)))
            .andExpect(status().isCreated());

        // Validate the Linkage in the database
        List<Linkage> linkageList = linkageRepository.findAll();
        assertThat(linkageList).hasSize(databaseSizeBeforeCreate + 1);
        Linkage testLinkage = linkageList.get(linkageList.size() - 1);
        assertThat(testLinkage.getCreationTime()).isEqualTo(DEFAULT_CREATION_TIME);
    }

    @Test
    @Transactional
    public void createLinkageWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = linkageRepository.findAll().size();

        // Create the Linkage with an existing ID
        linkage.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restLinkageMockMvc.perform(post("/api/linkages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(linkage)))
            .andExpect(status().isBadRequest());

        // Validate the Linkage in the database
        List<Linkage> linkageList = linkageRepository.findAll();
        assertThat(linkageList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void getAllLinkages() throws Exception {
        // Initialize the database
        linkageRepository.saveAndFlush(linkage);

        // Get all the linkageList
        restLinkageMockMvc.perform(get("/api/linkages?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(linkage.getId().intValue())))
            .andExpect(jsonPath("$.[*].creationTime").value(hasItem(DEFAULT_CREATION_TIME.toString())));
    }

    @Test
    @Transactional
    public void getLinkage() throws Exception {
        // Initialize the database
        linkageRepository.saveAndFlush(linkage);

        // Get the linkage
        restLinkageMockMvc.perform(get("/api/linkages/{id}", linkage.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(linkage.getId().intValue()))
            .andExpect(jsonPath("$.creationTime").value(DEFAULT_CREATION_TIME.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingLinkage() throws Exception {
        // Get the linkage
        restLinkageMockMvc.perform(get("/api/linkages/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateLinkage() throws Exception {
        // Initialize the database
        linkageRepository.saveAndFlush(linkage);
        int databaseSizeBeforeUpdate = linkageRepository.findAll().size();

        // Update the linkage
        Linkage updatedLinkage = linkageRepository.findOne(linkage.getId());
        // Disconnect from session so that the updates on updatedLinkage are not directly saved in db
        em.detach(updatedLinkage);
        updatedLinkage
            .creationTime(UPDATED_CREATION_TIME);

        restLinkageMockMvc.perform(put("/api/linkages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedLinkage)))
            .andExpect(status().isOk());

        // Validate the Linkage in the database
        List<Linkage> linkageList = linkageRepository.findAll();
        assertThat(linkageList).hasSize(databaseSizeBeforeUpdate);
        Linkage testLinkage = linkageList.get(linkageList.size() - 1);
        assertThat(testLinkage.getCreationTime()).isEqualTo(UPDATED_CREATION_TIME);
    }

    @Test
    @Transactional
    public void updateNonExistingLinkage() throws Exception {
        int databaseSizeBeforeUpdate = linkageRepository.findAll().size();

        // Create the Linkage

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restLinkageMockMvc.perform(put("/api/linkages")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(linkage)))
            .andExpect(status().isCreated());

        // Validate the Linkage in the database
        List<Linkage> linkageList = linkageRepository.findAll();
        assertThat(linkageList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteLinkage() throws Exception {
        // Initialize the database
        linkageRepository.saveAndFlush(linkage);
        int databaseSizeBeforeDelete = linkageRepository.findAll().size();

        // Get the linkage
        restLinkageMockMvc.perform(delete("/api/linkages/{id}", linkage.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Linkage> linkageList = linkageRepository.findAll();
        assertThat(linkageList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Linkage.class);
        Linkage linkage1 = new Linkage();
        linkage1.setId(1L);
        Linkage linkage2 = new Linkage();
        linkage2.setId(linkage1.getId());
        assertThat(linkage1).isEqualTo(linkage2);
        linkage2.setId(2L);
        assertThat(linkage1).isNotEqualTo(linkage2);
        linkage1.setId(null);
        assertThat(linkage1).isNotEqualTo(linkage2);
    }
}
