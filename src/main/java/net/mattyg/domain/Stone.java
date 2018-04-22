package net.mattyg.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A Stone.
 */
@Entity
@Table(name = "stone")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Stone implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "creation_time")
    private Instant creationTime;

    @Column(name = "short_name")
    private String shortName;

    @NotNull
    @Size(min = 10, max = 5000)
    @Column(name = "long_name", length = 5000, nullable = false)
    private String longName;

    @Column(name = "completion_time")
    private Instant completionTime;

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

    public Stone creationTime(Instant creationTime) {
        this.creationTime = creationTime;
        return this;
    }

    public void setCreationTime(Instant creationTime) {
        this.creationTime = creationTime;
    }

    public String getShortName() {
        return shortName;
    }

    public Stone shortName(String shortName) {
        this.shortName = shortName;
        return this;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getLongName() {
        return longName;
    }

    public Stone longName(String longName) {
        this.longName = longName;
        return this;
    }

    public void setLongName(String longName) {
        this.longName = longName;
    }

    public Instant getCompletionTime() {
        return completionTime;
    }

    public Stone completionTime(Instant completionTime) {
        this.completionTime = completionTime;
        return this;
    }

    public void setCompletionTime(Instant completionTime) {
        this.completionTime = completionTime;
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
        Stone stone = (Stone) o;
        if (stone.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), stone.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Stone{" +
            "id=" + getId() +
            ", creationTime='" + getCreationTime() + "'" +
            ", shortName='" + getShortName() + "'" +
            ", longName='" + getLongName() + "'" +
            ", completionTime='" + getCompletionTime() + "'" +
            "}";
    }
}
