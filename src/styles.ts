import { StyleSheet } from "react-native";
import { SPACING } from "src/contants";

export const STYLES = StyleSheet.create({
  button: {
    minWidth: 100
  },
  form: {
    minWidth: 300,
    width: '80%',
    maxWidth: 400,
    gap: SPACING.lg
  }
})