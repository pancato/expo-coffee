import { BrewportApp } from "@/components/brewport-app";
import { StatusBar } from "expo-status-bar";

export default function PassportRoute() {
  return (
    <>
      <BrewportApp view="passport" />
      <StatusBar hidden />
    </>
  );
}
