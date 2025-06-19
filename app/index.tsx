import { Alert, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card'; // import Card

export default function Index() {
  return (
    <View className='flex-1 justify-center items-center px-4 bg-background'>
      <Text className='text-2xl font-rubik-bold mb-6 text-foreground'>
        Gridify
      </Text>

      <Card
        title='Buttons'
        description='Examples of button variants'
        className='w-full max-w-md'
      >
        <View className='flex gap-4'>
          <Button
            title='Primary Button'
            onPress={() => Alert.alert('Primary Button Pressed')}
          />

          <Button
            title='Secondary'
            variant='secondary'
            onPress={() => Alert.alert('Secondary Pressed')}
          />

          <Button
            title='Destructive'
            variant='destructive'
            onPress={() => Alert.alert('Danger!')}
          />

          <Button
            variant='destructive'
            title='Loading'
            loading={true}
            onPress={() => {}}
          />

          <Button disabled={true} onPress={() => {}}>
            <Text className='text-white font-rubik-bold'>Disabled</Text>
          </Button>
        </View>
      </Card>
    </View>
  );
}
