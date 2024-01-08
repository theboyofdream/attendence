import { PropsWithChildren, createContext } from "react";
import { StyleSheet, View, } from "react-native";
import { Button, Text } from "~components";
import { COLORS, ROUNDNESS, SPACING } from "~src/theme";

const ModalContext = createContext({
  id: '',
  title: '',
  content: '',
  visible: false,
})

export function ModalProvider(props: PropsWithChildren) {

  return (
    <ModalContext.Provider>
      {props.children}
      <View style={[StyleSheet.absoluteFill, $.wrapper]}>
        <View style={$.modal}>
          <Text variant="subTitle">Permission</Text>
          <Text style={$.content}>Permission content</Text>
          <View style={$.actions}>
            <Button title="action" variant="secondary" />
            <Button title="action" variant="primary" />
          </View>
        </View>
      </View>
    </ModalContext.Provider>
  )
}


const $ = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.transparent,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modal: {
    width: '80%',
    minWidth: 300,
    maxWidth: 400,
    minHeight: 150,
    padding: SPACING.lg,
    borderRadius: ROUNDNESS.md,
    gap: SPACING.md,
    backgroundColor: COLORS.background,
    elevation: 24,

  },
  content: { flex: 1 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: SPACING.lg
  }
})
