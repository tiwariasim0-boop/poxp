import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import "./style.css";
import App from "./App.vue";

import CampaignList from "./views/CampaignList.vue";
import CampaignBuilder from "./views/CampaignBuilder.vue";
import CampaignDetail from "./views/CampaignDetail.vue";
import Analytics from "./views/Analytics.vue";
import SetupInstructions from "./views/SetupInstructions.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: CampaignList },
    { path: "/new", component: CampaignBuilder },
    { path: "/campaign/:id", component: CampaignDetail, props: true },
    { path: "/campaign/:id/analytics", component: Analytics, props: true },
    { path: "/campaign/:id/setup", component: SetupInstructions, props: true },
  ],
});

createApp(App).use(router).mount("#app");
