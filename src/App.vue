<template>
  <div
    class="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center p-4"
  >
    <!-- Контейнер с ограниченной шириной и тенями -->
    <div class="bg-white p-8 rounded-xl shadow-xl w-full max-w-xl">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">ToDoList Vue.JS</h1>
      <ToDoList />
    </div>
  </div>
</template>

<script setup>
import ToDoList from './components/ToDoList.vue';
</script>

<style>
/* Дополнительные глобальные стили при необходимости */
</style>
