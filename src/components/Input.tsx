import { View } from 'react-native';
import { Text, TextInput, TextInputProps, useTheme } from 'react-native-paper';

export type InputProps = TextInputProps & {
  errorText?: string;
};

export const Input = (props: InputProps) => {
  const { colors } = useTheme();
  return (
    <View>
      <TextInput maxLength={props.multiline ? undefined : 100} error={props.errorText != undefined} {...props} />
      {props.errorText && <Text style={{ color: colors.error }} children={props.errorText} />}
    </View>
  );
};
