package net.schwarzschild.repository;

import net.schwarzschild.domain.Stone;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Stone entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StoneRepository extends JpaRepository<Stone, Long> {

}
