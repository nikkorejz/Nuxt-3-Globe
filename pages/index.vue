<template>
  <div style="height: 100vh">
    <Globe :markers="data" />
  </div>
</template>

<script setup lang="ts">
import Globe from "@/components/Globe";
import { data } from "@/components/Globe/data";
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
