package net.schwarzschild.repository;

import net.schwarzschild.domain.Edge;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Edge entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EdgeRepository extends JpaRepository<Edge, Long> {

}
