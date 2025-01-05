import React from "react";
import "../styles/Main.css";

function Main() {
  const featuredRecipe = {
    title: "Spaghetti Carbonara",
    description: "A classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
    difficulty: "Medium",
    lastUpdated: "2025-01-01",
  };

  const projects = [
    {
      title: "Website",
      description: "",
      link: "",
    }
  ];

  return (
    <div className="home-container">
      <section className="welcome-section">
        <h1>Welcome to Recipe Manager App</h1>
        <p>
          You can create, view, edit, delete, and organize your
          favorite recipes!
        </p>
      </section>

      <section className="featured-recipe-section">
        <h2>Featured Recipe</h2>
        <div className="recipe-card">
          <h3>{featuredRecipe.title}</h3>
          <p>{featuredRecipe.description}</p>
          <p>
            <strong>Difficulty:</strong> {featuredRecipe.difficulty}
          </p>
          <p>
            <strong>Last Updated:</strong> {featuredRecipe.lastUpdated}
          </p>
        </div>
      </section>

      <section className="projects-section">
        <h2 className="projects-heading">Projects from Web and Mobile 1 Course</h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                View Project
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Main;
