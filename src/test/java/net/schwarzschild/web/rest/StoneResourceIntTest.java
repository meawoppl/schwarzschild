package net.schwarzschild.web.rest;

import net.schwarzschild.SchwarzschildApp;

import net.schwarzschild.domain.Stone;
import net.schwarzschild.repository.StoneRepository;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static net.schwarzschild.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the StoneResource REST controller.
 *
 * @see StoneResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = SchwarzschildApp.class)
public class StoneResourceIntTest {

    private static final Instant DEFAULT_COMPLETION_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_COMPLETION_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private StoneRepository stoneRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restStoneMockMvc;

    private Stone stone;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final StoneResource stoneResource = new StoneResource(stoneRepository);
        this.restStoneMockMvc = MockMvcBuilders.standaloneSetup(stoneResource)
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
    public static Stone createEntity(EntityManager em) {
        Stone stone = new Stone()
            .completionTime(DEFAULT_COMPLETION_TIME)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return stone;
    }

    @Before
    public void initTest() {
        stone = createEntity(em);
    }

    @Test
    @Transactional
    public void createStone() throws Exception {
        int databaseSizeBeforeCreate = stoneRepository.findAll().size();

        // Create the Stone
        restStoneMockMvc.perform(post("/api/stones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stone)))
            .andExpect(status().isCreated());

        // Validate the Stone in the database
        List<Stone> stoneList = stoneRepository.findAll();
        assertThat(stoneList).hasSize(databaseSizeBeforeCreate + 1);
        Stone testStone = stoneList.get(stoneList.size() - 1);
        assertThat(testStone.getCompletionTime()).isEqualTo(DEFAULT_COMPLETION_TIME);
        assertThat(testStone.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testStone.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    public void createStoneWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = stoneRepository.findAll().size();

        // Create the Stone with an existing ID
        stone.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restStoneMockMvc.perform(post("/api/stones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stone)))
            .andExpect(status().isBadRequest());

        // Validate the Stone in the database
        List<Stone> stoneList = stoneRepository.findAll();
        assertThat(stoneList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = stoneRepository.findAll().size();
        // set the field null
        stone.setName(null);

        // Create the Stone, which fails.

        restStoneMockMvc.perform(post("/api/stones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stone)))
            .andExpect(status().isBadRequest());

        List<Stone> stoneList = stoneRepository.findAll();
        assertThat(stoneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = stoneRepository.findAll().size();
        // set the field null
        stone.setDescription(null);

        // Create the Stone, which fails.

        restStoneMockMvc.perform(post("/api/stones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stone)))
            .andExpect(status().isBadRequest());

        List<Stone> stoneList = stoneRepository.findAll();
        assertThat(stoneList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllStones() throws Exception {
        // Initialize the database
        stoneRepository.saveAndFlush(stone);

        // Get all the stoneList
        restStoneMockMvc.perform(get("/api/stones?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stone.getId().intValue())))
            .andExpect(jsonPath("$.[*].completionTime").value(hasItem(DEFAULT_COMPLETION_TIME.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    @Transactional
    public void getStone() throws Exception {
        // Initialize the database
        stoneRepository.saveAndFlush(stone);

        // Get the stone
        restStoneMockMvc.perform(get("/api/stones/{id}", stone.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(stone.getId().intValue()))
            .andExpect(jsonPath("$.completionTime").value(DEFAULT_COMPLETION_TIME.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingStone() throws Exception {
        // Get the stone
        restStoneMockMvc.perform(get("/api/stones/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateStone() throws Exception {
        // Initialize the database
        stoneRepository.saveAndFlush(stone);
        int databaseSizeBeforeUpdate = stoneRepository.findAll().size();

        // Update the stone
        Stone updatedStone = stoneRepository.findOne(stone.getId());
        // Disconnect from session so that the updates on updatedStone are not directly saved in db
        em.detach(updatedStone);
        updatedStone
            .completionTime(UPDATED_COMPLETION_TIME)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restStoneMockMvc.perform(put("/api/stones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedStone)))
            .andExpect(status().isOk());

        // Validate the Stone in the database
        List<Stone> stoneList = stoneRepository.findAll();
        assertThat(stoneList).hasSize(databaseSizeBeforeUpdate);
        Stone testStone = stoneList.get(stoneList.size() - 1);
        assertThat(testStone.getCompletionTime()).isEqualTo(UPDATED_COMPLETION_TIME);
        assertThat(testStone.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testStone.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    public void updateNonExistingStone() throws Exception {
        int databaseSizeBeforeUpdate = stoneRepository.findAll().size();

        // Create the Stone

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restStoneMockMvc.perform(put("/api/stones")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(stone)))
            .andExpect(status().isCreated());

        // Validate the Stone in the database
        List<Stone> stoneList = stoneRepository.findAll();
        assertThat(stoneList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteStone() throws Exception {
        // Initialize the database
        stoneRepository.saveAndFlush(stone);
        int databaseSizeBeforeDelete = stoneRepository.findAll().size();

        // Get the stone
        restStoneMockMvc.perform(delete("/api/stones/{id}", stone.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<Stone> stoneList = stoneRepository.findAll();
        assertThat(stoneList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Stone.class);
        Stone stone1 = new Stone();
        stone1.setId(1L);
        Stone stone2 = new Stone();
        stone2.setId(stone1.getId());
        assertThat(stone1).isEqualTo(stone2);
        stone2.setId(2L);
        assertThat(stone1).isNotEqualTo(stone2);
        stone1.setId(null);
        assertThat(stone1).isNotEqualTo(stone2);
    }
}
