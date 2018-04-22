package net.mattyg.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A Linkage.
 */
@Entity
@Table(name = "linkage")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Linkage implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creation_time")
    private Instant creationTime;

    @OneToOne
    @JoinColumn(unique = true)
    private Stone dependee;

    @OneToOne
    @JoinColumn(unique = true)
    private Stone dependant;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreationTime() {
        return creationTime;
    }

    public Linkage creationTime(Instant creationTime) {
        this.creationTime = creationTime;
        return this;
    }

    public void setCreationTime(Instant creationTime) {
        this.creationTime = creationTime;
    }

    public Stone getDependee() {
        return dependee;
    }

    public Linkage dependee(Stone stone) {
        this.dependee = stone;
        return this;
    }

    public void setDependee(Stone stone) {
        this.dependee = stone;
    }

    public Stone getDependant() {
        return dependant;
    }

    public Linkage dependant(Stone stone) {
        this.dependant = stone;
        return this;
    }

    public void setDependant(Stone stone) {
        this.dependant = stone;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Linkage linkage = (Linkage) o;
        if (linkage.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), linkage.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Linkage{" +
            "id=" + getId() +
            ", creationTime='" + getCreationTime() + "'" +
            "}";
    }
}
