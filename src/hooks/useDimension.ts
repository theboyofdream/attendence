import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export function useDimension() {
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('screen'))

  useEffect(() => {
    Dimensions.addEventListener('change', function (newDimensions) {
      setDimensions(newDimensions.screen)
    })
  }, [])
  return {
    ...dimensions
  }
  // return { 
  //   width: dimensions.width * dimensions.scale,
  //   height: dimensions.height * dimensions.scale
  //  }
}
