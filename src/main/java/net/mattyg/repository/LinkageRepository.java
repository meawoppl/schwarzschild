package net.mattyg.repository;

import net.mattyg.domain.Linkage;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;


/**
 * Spring Data JPA repository for the Linkage entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LinkageRepository extends JpaRepository<Linkage, Long> {

}
