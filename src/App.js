import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Calendar,
  Clock,
} from "lucide-react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="popup-overlay">
      <div className="popup">
        <p>{message}</p>
        <div className="popup-actions">
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirmer
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const [taskToDelete, setTaskToDelete] = useState(null);

  // configuration de l'API
  const API_BASE_URL = "http://localhost:3000/api";

  // Recupere les taches backend
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // doonnées brut pour la demonstration
      // setTasks([
      //   {
      //     id: 1,
      //     title: "Terminer le projet React",
      //     description: "Implémenter les fonctionnalités CRUD",
      //     completed: false,
      //     priority: "high",
      //     dueDate: "2024-12-15",
      //     createdAt: new Date(),
      //   },
      //   {
      //     id: 2,
      //     title: "Réviser NestJS",
      //     description: "Comprendre les décorateurs et modules",
      //     completed: true,
      //     priority: "medium",
      //     dueDate: "2024-12-10",
      //     createdAt: new Date(),
      //   },
      //   {
      //     id: 3,
      //     title: "Configurer MySQL",
      //     description: "Installer et configurer la base de données",
      //     completed: false,
      //     priority: "low",
      //     dueDate: "2024-12-20",
      //     createdAt: new Date(),
      //   },
      // ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Créer un nouvelle tâche
  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const newTask = await response.json();
        setTasks((prev) => [...prev, newTask]);
        toast.success("Tâche créée avec succès !");
        return true;
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Erreur lors de la création de la tâche.");
      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date(),
      };
      setTasks((prev) => [...prev, newTask]);
      return true;
    }
    return false;
  };

  // Mettre à jour une tâche
  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? updatedTask : task))
        );
        toast.success("Tâche mise à jour !");
        return true;
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Erreur lors de la mise à jour.");
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, ...taskData } : task))
      );
      return true;
    }
    return false;
  };

  // Supprimer une tâche
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
        toast.success("Tâche supprimée !");
        return true;
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Erreur lors de la suppression.");
      setTasks((prev) => prev.filter((task) => task.id !== id));
      return true;
    }
    return false;
  };

  // Confirmer la suppression
  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // filtrer les tâches en fonction de la recherche et des filtres
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || task.priority === filterPriority;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && task.completed) ||
      (filterStatus === "pending" && !task.completed);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // gerer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const success = await createTask(newTask);
    if (success) {
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        dueDate: "",
      });
      setShowAddForm(false);
    }
  };

  // gerer la soumission de modificatiosn
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingTask.title.trim()) return;

    const success = await updateTask(editingTask.id, editingTask);
    if (success) {
      setEditingTask(null);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  return (
    <div className="task-manager">
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-content">
            <div>
              <h1 className="header-title">Gestionnaire de Tâches</h1>
              <p className="header-subtitle">
                Organisez vos projets avec style et efficacité
              </p>
            </div>
            <div className="stats-container">
              <div className="stat-item">
                <p className="stat-label">Total des tâches</p>
                <p className="stat-value stat-total">{tasks.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container">
        {/* chercher et filtrer*/}
        <div className="card card-padding card-margin">
          <div className="search-filters">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filters-container">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="all">Toutes priorités</option>
                <option value="high">Priorité haute</option>
                <option value="medium">Priorité moyenne</option>
                <option value="low">Priorité basse</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
              className="btn btn-primary"
            >
              <Plus className="h-5 w-5" />
              Nouvelle tâche
            </button>
          </div>
        </div>

        {/* Formulaitre d'Ajout de tâche */}
        {showAddForm && (
          <div className="card card-padding card-margin">
            <h2 className="form-title">Créer une nouvelle tâche</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Titre *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  className="form-input"
                  placeholder="Titre de la tâche"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  className="form-input form-textarea"
                  placeholder="Description détaillée"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Priorité</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Date d'échéance</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) =>
                      setNewTask({ ...newTask, dueDate: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-success">
                  <Check className="h-5 w-5" />
                  Créer la tâche
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-secondary"
                >
                  <X className="h-5 w-5" />
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listes des tâches */}
        <div className="task-list">
          {isLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Chargement des tâches...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <p className="empty-title">Aucune tâche trouvée</p>
              <p className="empty-subtitle">
                Commencez par créer votre première tâche !
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`task-item ${
                  task.completed ? "task-item-completed" : ""
                }`}
              >
                {editingTask?.id === task.id ? (
                  <div className="task-content">
                    <form onSubmit={handleEditSubmit}>
                      <div className="form-group">
                        <input
                          type="text"
                          value={editingTask.title}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              title: e.target.value,
                            })
                          }
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <textarea
                          value={editingTask.description}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              description: e.target.value,
                            })
                          }
                          className="form-input form-textarea"
                        />
                      </div>
                      <div className="form-grid">
                        <select
                          value={editingTask.priority}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              priority: e.target.value,
                            })
                          }
                          className="form-input"
                        >
                          <option value="low">Basse</option>
                          <option value="medium">Moyenne</option>
                          <option value="high">Haute</option>
                        </select>
                        <input
                          type="date"
                          value={editingTask.dueDate}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              dueDate: e.target.value,
                            })
                          }
                          className="form-input"
                        />
                      </div>
                      <div className="form-actions">
                        <button
                          type="submit"
                          className="btn btn-success btn-small"
                        >
                          <Check className="h-4 w-4" />
                          Sauvegarder
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTask(null)}
                          className="btn btn-secondary btn-small"
                        >
                          <X className="h-4 w-4" />
                          Annuler
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="task-content">
                    <div className="task-header">
                      <div className="task-main">
                        <div className="task-title-row">
                          <h3
                            className={`task-title ${
                              task.completed ? "task-title-completed" : ""
                            }`}
                          >
                            {task.title}
                          </h3>
                          <span
                            className={`priority-badge ${getPriorityClass(
                              task.priority
                            )}`}
                          >
                            {task.priority === "high"
                              ? "Haute"
                              : task.priority === "medium"
                              ? "Moyenne"
                              : "Basse"}
                          </span>
                        </div>

                        {task.description && (
                          <p
                            className={`task-description ${
                              task.completed ? "task-description-completed" : ""
                            }`}
                          >
                            {task.description}
                          </p>
                        )}

                        <div className="task-meta">
                          {task.dueDate && (
                            <div className="task-meta-item">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(task.dueDate).toLocaleDateString(
                                  "fr-FR"
                                )}
                              </span>
                            </div>
                          )}
                          <div className="task-meta-item">
                            <Clock className="h-4 w-4" />
                            <span>
                              Créé le{" "}
                              {new Date(task.createdAt).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="task-actions">
                        <button
                          onClick={() => setEditingTask(task)}
                          className="btn-icon btn-icon-blue"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setTaskToDelete(task)}
                          className="btn-icon btn-icon-red"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Popup confirmation suppression */}
      {taskToDelete && (
        <ConfirmPopup
          message={`Voulez-vous vraiment supprimer la tâche "${taskToDelete.title}" ?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}

      {/*  Notifications Toast */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
