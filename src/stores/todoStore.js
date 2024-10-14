// src/stores/todoStore.js

import { defineStore } from 'pinia';

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [], // Массив задач
  }),
  getters: {
    todoCount: (state) => state.todos.length, // Количество задач
  },
  actions: {
    // Добавляет новую задачу
    addTodo(todo) {
      this.todos.push(todo);
      this.saveToLocalStorage();
    },
    // Удаляет задачу по индексу
    removeTodo(index) {
      this.todos.splice(index, 1);
      this.saveToLocalStorage();
    },
    // Обновляет задачу по индексу
    updateTodo(index, newTodo) {
      this.todos[index] = newTodo;
      this.saveToLocalStorage();
    },
    // Переключает состояние завершения задачи
    toggleTodoCompletion(index) {
      this.todos[index].completed = !this.todos[index].completed;
      this.saveToLocalStorage();
      console.log(`Задача ${index} завершена:`, this.todos[index].completed); // Лог для проверки
    },
    // Сохраняет задачи в localStorage
    saveToLocalStorage() {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    },
    // Загружает задачи из localStorage
    loadFromLocalStorage() {
      const todos = localStorage.getItem('todos');
      if (todos) {
        this.todos = JSON.parse(todos);
      }
    },
  },
});
