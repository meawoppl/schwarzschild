package net.schwarzschild.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.util.Objects;

/**
 * A Edge.
 */
@Entity
@Table(name = "edge")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Edge implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 100)
    @Column(name = "description", length = 100, nullable = false)
    private String description;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Stone from;

    @OneToOne(optional = false)
    @NotNull
    @JoinColumn(unique = true)
    private Stone to;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public Edge description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Stone getFrom() {
        return from;
    }

    public Edge from(Stone stone) {
        this.from = stone;
        return this;
    }

    public void setFrom(Stone stone) {
        this.from = stone;
    }

    public Stone getTo() {
        return to;
    }

    public Edge to(Stone stone) {
        this.to = stone;
        return this;
    }

    public void setTo(Stone stone) {
        this.to = stone;
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
        Edge edge = (Edge) o;
        if (edge.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), edge.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "Edge{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
