<script setup lang="ts">
import { Upload, Clock, Globe, DollarSign } from "lucide-vue-next";
import { NuxtLink } from "#components";
import { getTimezones, searchTimezones, getDefaultTimezone, getCurrencies, searchCurrencies } from "~/utils";

const logoPreview = ref<string | null>(null);
const { organizationForm } = useOrganizationStore();
const timezoneSearch = ref("");
const selectedTimezone = ref(
  organizationForm.settings.timezone || getDefaultTimezone(),
);
const isTimezoneDropdownOpen = ref(false);
const availableTimezones = ref<ReturnType<typeof getTimezones>>([]);
const filteredTimezones = computed(() =>
  searchTimezones(timezoneSearch.value, availableTimezones.value).slice(0, 20),
);

const currencySearch = ref("");
const selectedCurrency = ref(organizationForm.settings.currency || "USD");
const isCurrencyDropdownOpen = ref(false);
const availableCurrencies = ref<ReturnType<typeof getCurrencies>>([]);
const filteredCurrencies = computed(() =>
  searchCurrencies(currencySearch.value, availableCurrencies.value).slice(0, 30),
);

onMounted(() => {
  availableTimezones.value = getTimezones();
  if (!selectedTimezone.value) {
    selectedTimezone.value = getDefaultTimezone();
  }
  organizationForm.settings.timezone = selectedTimezone.value;
  
  availableCurrencies.value = getCurrencies();
  if (!selectedCurrency.value) {
    selectedCurrency.value = "USD";
  }
  organizationForm.settings.currency = selectedCurrency.value;
});

const handleLogoUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    organizationForm.logo = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const selectTimezone = (tz: { value: string; label: string }) => {
  selectedTimezone.value = tz.value;
  organizationForm.settings.timezone = tz.value;
  isTimezoneDropdownOpen.value = false;
  timezoneSearch.value = "";
};

const selectCurrency = (currency: { code: string; name: string; symbol: string }) => {
  selectedCurrency.value = currency.code;
  organizationForm.settings.currency = currency.code;
  isCurrencyDropdownOpen.value = false;
  currencySearch.value = "";
};
</script>

<template>
  <div class="min-h-screen bg-muted flex items-center justify-center p-4">
    <div class="w-full max-w-2xl">
      <!-- Compact progress bar -->
      <div class="mb-6 flex items-center justify-between text-sm">
        <span class="font-medium text-foreground">Step 2 of 3</span>
        <div class="flex items-center gap-2">
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-blue-600 rounded-full"></div>
          <div class="w-24 h-1.5 bg-muted rounded-full"></div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle class="text-2xl">Workspace Configuration</CardTitle>
          <CardDescription>Configure your workspace settings</CardDescription>
        </CardHeader>

        <CardContent class="space-y-4">
          <!-- Timezone Selection -->
          <div class="space-y-2">
            <Label class="flex items-center gap-2">
              <Globe class="w-4 h-4" />
              Timezone
            </Label>
            <div class="relative">
              <div
                @click="isTimezoneDropdownOpen = !isTimezoneDropdownOpen"
                class="cursor-pointer border rounded-md px-3 py-2 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <span class="text-sm">{{
                  selectedTimezone.replace(/_/g, " ")
                }}</span>
                <Clock class="w-4 h-4 text-muted-foreground" />
              </div>

              <div
                v-if="isTimezoneDropdownOpen"
                class="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                <div class="p-2 sticky top-0 bg-background border-b">
                  <Input
                    v-model="timezoneSearch"
                    placeholder="Search timezone..."
                    @click.stop
                  />
                </div>
                <div
                  v-for="tz in filteredTimezones"
                  :key="tz.value"
                  @click="selectTimezone(tz)"
                  class="px-3 py-2 text-sm hover:bg-accent cursor-pointer flex items-center justify-between"
                >
                  <span>{{ tz.label }}</span>
                  <span class="text-xs text-muted-foreground">{{
                    tz.offset
                  }}</span>
                </div>
                <div
                  v-if="filteredTimezones.length === 0"
                  class="px-3 py-4 text-sm text-muted-foreground text-center"
                >
                  No timezones found
                </div>
              </div>
            </div>
          </div>

          <!-- Currency -->
          <div class="space-y-2">
            <Label class="flex items-center gap-2">
              <DollarSign class="w-4 h-4" />
              Currency
            </Label>
            <div class="relative">
              <div
                @click="isCurrencyDropdownOpen = !isCurrencyDropdownOpen"
                class="cursor-pointer border rounded-md px-3 py-2 flex items-center justify-between hover:bg-accent transition-colors"
              >
                <span class="text-sm">{{
                  availableCurrencies.find(c => c.code === selectedCurrency)?.name || selectedCurrency
                }}</span>
                <span class="text-muted-foreground">{{
                  availableCurrencies.find(c => c.code === selectedCurrency)?.symbol || selectedCurrency
                }}</span>
              </div>
              
              <div
                v-if="isCurrencyDropdownOpen"
                class="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto"
              >
                <div class="p-2 sticky top-0 bg-background border-b">
                  <Input
                    v-model="currencySearch"
                    placeholder="Search currency..."
                    @click.stop
                  />
                </div>
                <div
                  v-for="currency in filteredCurrencies"
                  :key="currency.code"
                  @click="selectCurrency(currency)"
                  class="px-3 py-2 text-sm hover:bg-accent cursor-pointer flex items-center justify-between"
                >
                  <span class="flex-1">{{ currency.name }}</span>
                  <span class="text-muted-foreground font-medium">{{ currency.symbol }}</span>
                  <span class="text-xs text-muted-foreground ml-2">{{ currency.code }}</span>
                </div>
                <div
                  v-if="filteredCurrencies.length === 0"
                  class="px-3 py-4 text-sm text-muted-foreground text-center"
                >
                  No currencies found
                </div>
              </div>
            </div>
          </div>

          <!-- Working Hours -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Working Hours Start</Label>
              <Input
                v-model="organizationForm.settings.workingHoursStart"
                type="time"
              />
            </div>
            <div class="space-y-2">
              <Label>Working Hours End</Label>
              <Input
                v-model="organizationForm.settings.workingHoursEnd"
                type="time"
              />
            </div>
          </div>

          <!-- Logo -->
          <div class="space-y-2">
            <Label>Logo (Optional)</Label>
            <label class="cursor-pointer">
              <div
                class="border-2 border-dashed rounded-lg p-4 text-center hover:border-blue-400 transition-colors"
              >
                <Upload class="w-6 h-6 mx-auto text-muted-foreground mb-1" />
                <p class="text-sm text-muted-foreground">Upload your logo</p>
              </div>
              <input
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleLogoUpload"
              />
            </label>
            <div v-if="logoPreview" class="mt-2">
              <img
                :src="logoPreview"
                alt="Logo"
                class="w-16 h-16 rounded object-cover"
              />
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex justify-between">
          <Button variant="ghost" :as="NuxtLink" to="/onboarding/step-1">
            Back
          </Button>
          <Button :as="NuxtLink" to="/onboarding/step-3">Continue</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
