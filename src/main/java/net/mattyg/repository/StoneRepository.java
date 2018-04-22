package net.mattyg.repository;

import net.mattyg.domain.Stone;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Stone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StoneRepository extends JpaRepository<Stone, Long> {

}
