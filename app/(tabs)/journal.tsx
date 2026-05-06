import { BrewportApp } from "@/components/brewport-app";
import { StatusBar } from "expo-status-bar";

export default function JournalRoute() {
  return (
    <>
      <BrewportApp view="journal" />
      <StatusBar hidden />
    </>
  );
}
