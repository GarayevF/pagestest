import React, { useState, useEffect } from "react";
import "../styles/Recipe.css";

const Recipe = () => {

  const [recipes, setRecipes] = useState([]);

  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const reorderedItems = Array.from(recipes);
    const [movedItem] = reorderedItems.splice(draggedItemIndex, 1);
    reorderedItems.splice(index, 0, movedItem);

    setRecipes(reorderedItems);
    setDraggedItemIndex(null);
  };


  
  const [showForm, setShowForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    tags: "",
    difficulty: "Easy",
  });
  const [editIndex, setEditIndex] = useState(null);

  const API_URL = "http://localhost:3000/recipes";

  useEffect(() => {
    fetch("http://localhost:3000/recipes?_page=3&_limit=30")
      .then((res) => res.json())
      .then((data) => setRecipes(data))
      .catch((err) => console.error("Error fetching recipes:", err));
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (editIndex !== null) {
      const updatedRecipes = [...recipes];
      updatedRecipes[index][name] = value;
      updatedRecipes[index].lastUpdated = new Date().toLocaleString();
      setRecipes(updatedRecipes);
    } else {
      setNewRecipe({ ...newRecipe, [name]: value });
    }
  };

  const handleAddRecipe = () => {
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newRecipe,
        id: Date.now().toString(),
        lastUpdated: new Date().toLocaleString()
      }),
    })
      .then((res) => res.json())
      .then((newRecipe) => {
        setRecipes([...recipes, newRecipe]);
        setNewRecipe({
          title: "",
          description: "",
          ingredients: "",
          steps: "",
          tags: "",
          difficulty: "Easy",
        });
        setShowForm(false);
      })
      .catch((err) => console.error("Error adding recipe:", err));
  };

  const handleEditRecipe = (index) => {
    setEditIndex(index);
  };

  const handleSaveEdit = (index) => {
    const updatedRecipe = recipes[index];
    fetch(`${API_URL}/${updatedRecipe.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRecipe),
    })
      .then((res) => res.json())
      .then(() => {
        setEditIndex(null);
      })
      .catch((err) => console.error("Error updating recipe:", err));
  };

  const handleDeleteRecipe = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
      })
      .catch((err) => console.error("Error deleting recipe:", err));
  };

  return (
    <div className="container">
      <button
        className="create-recipe-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "New Recipe"}
      </button>

      {showForm && (
        <div className="recipe-form">
          <h3>Create Recipe</h3>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newRecipe.title}
            onChange={(e) => handleInputChange(e)}
          />
          <textarea
            name="description"
            placeholder="Description"
            rows="2"
            value={newRecipe.description}
            onChange={(e) => handleInputChange(e)}
          ></textarea>
          <textarea
            name="ingredients"
            placeholder="Ingredients"
            rows="2"
            value={newRecipe.ingredients}
            onChange={(e) => handleInputChange(e)}
          ></textarea>
          <textarea
            name="steps"
            placeholder="Steps"
            rows="2"
            value={newRecipe.steps}
            onChange={(e) => handleInputChange(e)}
          ></textarea>
          <input
            type="text"
            name="tags"
            placeholder="Tags"
            value={newRecipe.tags}
            onChange={(e) => handleInputChange(e)}
          />
          <select
            name="difficulty"
            value={newRecipe.difficulty}
            onChange={(e) => handleInputChange(e)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button className="save-button" onClick={handleAddRecipe}>
            Save
          </button>
        </div>
      )}

      <div className="recipe-cards-container">
        {recipes.map((recipe, index) => (
          <div className="recipe-card" key={recipe.id} 
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(index)}
          >
            {editIndex === index ? (
              <div className="recipe-edit-form">
                <label htmlFor={`title-${index}`} className="input-label">
                  Title
                </label>
                <input
                  id={`title-${index}`}
                  type="text"
                  name="title"
                  value={recipe.title}
                  onChange={(e) => handleInputChange(e, index)}
                />

                <label htmlFor={`description-${index}`} className="input-label">
                  Description
                </label>
                <textarea
                  id={`description-${index}`}
                  name="description"
                  rows="3"
                  value={recipe.description}
                  onChange={(e) => handleInputChange(e, index)}
                ></textarea>

                <label htmlFor={`ingredients-${index}`} className="input-label">
                  Ingredients
                </label>
                <textarea
                  id={`ingredients-${index}`}
                  name="ingredients"
                  rows="3"
                  value={recipe.ingredients}
                  onChange={(e) => handleInputChange(e, index)}
                ></textarea>

                <label htmlFor={`steps-${index}`} className="input-label">
                  Steps
                </label>
                <textarea
                  id={`steps-${index}`}
                  name="steps"
                  rows="3"
                  value={recipe.steps}
                  onChange={(e) => handleInputChange(e, index)}
                ></textarea>

                <label htmlFor={`tags-${index}`} className="input-label">
                  Tags
                </label>
                <input
                  id={`tags-${index}`}
                  type="text"
                  name="tags"
                  value={recipe.tags}
                  onChange={(e) => handleInputChange(e, index)}
                />

                <label htmlFor={`difficulty-${index}`} className="input-label">
                  Difficulty
                </label>
                <select
                  id={`difficulty-${index}`}
                  name="difficulty"
                  value={recipe.difficulty}
                  onChange={(e) => handleInputChange(e, index)}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <div className="actions">
                  <button onClick={() => handleSaveEdit(index)}>Save</button>
                </div>
              </div>
            ) : (
              <div className="recipe-card-content">
                <h3>{recipe.title}</h3>
                <p>
                  <strong>Description:</strong> {recipe.description}
                </p>
                <p>
                  <strong>Ingredients:</strong> {recipe.ingredients}
                </p>
                <p>
                  <strong>Steps:</strong> {recipe.steps}
                </p>
                <p>
                  <strong>Tags:</strong> {recipe.tags}
                </p>
                <p>
                  <strong>Difficulty:</strong> {recipe.difficulty}
                </p>
                <div className="actions">
                  <button onClick={() => handleEditRecipe(index)}>Edit</button>
                  <button onClick={() => handleDeleteRecipe(recipe.id)}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recipe;
