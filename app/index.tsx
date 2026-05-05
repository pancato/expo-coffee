import { BrewportApp } from "@/components/brewport-app";
import { StatusBar } from "expo-status-bar";

export default function Index() {
  return (
    <>
      <BrewportApp />
      <StatusBar hidden />
    </>
  );
}
