import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

// 2026 cityscape from R_P Design 2026.fig — "loading page" (node 1879:252).
// Fixed 454x282 art; scale the parent to fit the screen.

export const CITYSCAPE_WIDTH = 454;
export const CITYSCAPE_HEIGHT = 282;

const signText = {
  fontFamily: 'ShareTechMono',
  color: 'rgb(255,255,255)',
  textAlign: 'center' as const,
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 4,
};

function Streetlight() {
  return (
    <View style={{ width: 10, height: 19, overflow: 'hidden' }}>
      {[0, 6].map((left, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left,
            top: 0,
            width: 4,
            height: 19,
            overflow: 'hidden',
            transform: i === 0 ? [{ scaleX: -1 }] : [],
          }}>
          <View style={{ position: 'absolute', left: 1, top: 0, width: 3, height: 4, backgroundColor: 'rgb(255,255,255)' }} />
          <View style={{ position: 'absolute', left: 0, top: 2, width: 1, height: 17, backgroundColor: 'rgb(45,45,45)' }} />
        </View>
      ))}
    </View>
  );
}

function WindowRow({ top }: { top: number }) {
  return (
    <View style={{ position: 'absolute', left: 17, top, width: 68, height: 15, overflow: 'hidden', flexDirection: 'row', gap: 4 }}>
      {[...Array(6)].map((_, i) => (
        <View key={i} style={{ width: 8, height: 15, backgroundColor: 'rgb(220,160,255)' }} />
      ))}
    </View>
  );
}

export default function RPCityScape() {
  return (
    <View style={{ width: CITYSCAPE_WIDTH, height: CITYSCAPE_HEIGHT, overflow: 'hidden' }}>
      <LinearGradient
        colors={['rgb(6,6,8)', 'rgb(109,82,110)']}
        style={{ position: 'absolute', left: 215, top: 141, width: 25, height: 24 }}
      />
      <LinearGradient
        colors={['rgb(0,0,0)', 'rgb(109,82,110)']}
        locations={[0, 0.5663]}
        style={{ position: 'absolute', left: 374, top: 0, width: 80, height: 244 }}
      />
      <View style={{ position: 'absolute', left: 132, top: 161, width: 180, height: 79, backgroundColor: 'rgb(0,5,8)' }} />
      <View style={{ position: 'absolute', left: 202, top: 155, width: 34, height: 21, backgroundColor: 'rgb(0,0,0)' }} />
      <View style={{ position: 'absolute', left: 238, top: 94, width: 50, height: 123, backgroundColor: 'rgb(0,0,0)' }} />

      {/* Slim tower with antenna, left of center */}
      <View style={{ position: 'absolute', left: 171, top: 118, width: 65, height: 87, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, top: 9, width: 31, height: 77, backgroundColor: 'rgb(0,0,0)' }} />
        <View style={{ position: 'absolute', left: 5, top: 6, width: 14, height: 4, backgroundColor: 'rgb(1,1,1)' }} />
        <View style={{ position: 'absolute', left: 7, top: 0, width: 2, height: 10, backgroundColor: 'rgb(1,1,1)' }} />
        <View style={{ position: 'absolute', left: 11, top: 0, width: 2, height: 10, backgroundColor: 'rgb(1,1,1)' }} />
        <View style={{ position: 'absolute', left: 7, top: 26, width: 23, height: 2, backgroundColor: 'rgb(18,8,30)' }} />
        <View style={{ position: 'absolute', left: 7, top: 32, width: 23, height: 2, backgroundColor: 'rgb(18,8,30)' }} />
        <View style={{ position: 'absolute', left: 7, top: 39, width: 58, height: 2, backgroundColor: 'rgb(18,8,30)' }} />
        <View style={{ position: 'absolute', left: 7, top: 45, width: 58, height: 2, backgroundColor: 'rgb(18,8,30)' }} />
        <View style={{ position: 'absolute', left: 7, top: 52, width: 58, height: 2, backgroundColor: 'rgb(18,8,30)' }} />
        <View style={{ position: 'absolute', left: 7, top: 58, width: 58, height: 2, backgroundColor: 'rgb(18,8,30)' }} />
        <View style={{ position: 'absolute', left: 10, top: 25, width: 2, height: 62, backgroundColor: 'rgb(1,1,1)' }} />
      </View>

      {/* TECH neon sign */}
      <View style={{ position: 'absolute', left: 235, top: 99, width: 18, height: 49, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 18,
            height: 49,
            borderRadius: 1,
            backgroundColor: 'rgb(199,49,214)',
            boxShadow: '0px 4px 20px 6px rgb(199,49,214)',
          }}
        />
        <Text
          style={[signText, { position: 'absolute', left: 4, top: 4, width: 10, fontSize: 9, lineHeight: 10, textShadowColor: 'rgb(220,160,255)' }]}>
          {'T\nE\nC\nH'}
        </Text>
      </View>

      {/* 2026 lilac sign */}
      <View style={{ position: 'absolute', left: 244, top: 124, width: 16, height: 38, overflow: 'hidden' }}>
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 16,
            height: 38,
            borderRadius: 1,
            backgroundColor: 'rgb(220,160,255)',
            boxShadow: '0px 4px 20px 6px rgba(220,160,255,0.6)',
          }}
        />
        <Text
          style={[signText, { position: 'absolute', left: 4, top: 2, width: 8, fontSize: 8, lineHeight: 8, textShadowColor: 'rgb(165,17,180)' }]}>
          {'2\n0\n2\n6'}
        </Text>
      </View>

      <View style={{ position: 'absolute', left: 66, top: 57, width: 12, height: 171, backgroundColor: 'rgb(0,0,0)' }} />
      <View style={{ position: 'absolute', left: 318, top: 211, width: 29, height: 33, backgroundColor: 'rgb(29,29,29)' }} />

      {/* Lone streetlight half, far left */}
      <View style={{ position: 'absolute', left: 12, top: 177, width: 4, height: 19, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 1, top: 0, width: 3, height: 4, backgroundColor: 'rgb(255,255,255)' }} />
        <View style={{ position: 'absolute', left: 0, top: 2, width: 1, height: 17, backgroundColor: 'rgb(45,45,45)' }} />
      </View>

      <View style={{ position: 'absolute', left: 398, top: 49, width: 4, height: 145, backgroundColor: 'rgb(0,0,0)' }} />

      {/* Wide right building with slatted windows */}
      <View style={{ position: 'absolute', left: 294, top: 49, width: 140, height: 233, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, width: 140, height: 233, backgroundColor: 'rgb(0,0,0)' }} />
        {[7, 15, 24, 32, 40].map((top) => (
          <View key={top} style={{ position: 'absolute', left: 8, top, width: 118, height: 5, backgroundColor: 'rgb(71,87,142)' }} />
        ))}
        <View style={{ position: 'absolute', left: 67, top: 4, width: 4, height: 143, backgroundColor: 'rgb(0,0,0)' }} />
        <View style={{ position: 'absolute', left: 104, top: 0, width: 4, height: 145, backgroundColor: 'rgb(0,0,0)' }} />
        <View style={{ position: 'absolute', left: 9, top: 60, width: 113, height: 10, backgroundColor: 'rgb(71,87,142)' }} />
        <View style={{ position: 'absolute', left: 9, top: 77, width: 113, height: 10, backgroundColor: 'rgb(71,87,142)' }} />
      </View>

      {/* Blue 2026 billboard tower */}
      <View style={{ position: 'absolute', left: 272, top: 76, width: 95, height: 120, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 40, top: 0, width: 55, height: 120, backgroundColor: 'rgb(0,0,0)' }} />
        <View style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 101, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', left: 43, top: 70, width: 5, height: 9, backgroundColor: 'rgb(75,11,111)' }} />
          <View style={{ position: 'absolute', left: 43, top: 21, width: 5, height: 9, backgroundColor: 'rgb(75,11,111)' }} />
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 43,
              height: 101,
              overflow: 'hidden',
              borderRadius: 1,
              boxShadow: '0px 4px 26px 0px rgb(4,154,235)',
            }}>
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 43,
                height: 101,
                backgroundColor: 'rgb(17,52,180)',
                boxShadow: '0px 4px 20px 6px rgb(4,154,235)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 47.292,
                top: -0.561,
                width: 11,
                height: 89.711,
                backgroundColor: 'rgb(109,141,255)',
                transformOrigin: 'top left',
                transform: [{ rotate: '38.2deg' }],
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 47.51,
                top: 25,
                width: 11,
                height: 89.711,
                backgroundColor: 'rgb(109,141,255)',
                transformOrigin: 'top left',
                transform: [{ rotate: '38.2deg' }],
              }}
            />
            <Text
              style={[signText, { position: 'absolute', left: 12, top: 0, width: 19, fontSize: 24, lineHeight: 24, textShadowColor: 'rgb(49,184,214)' }]}>
              {'2\n0\n2\n6'}
            </Text>
          </View>
        </View>
      </View>

      {/* Small R|P sign */}
      <View style={{ position: 'absolute', left: 183, top: 129, width: 18, height: 15, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, width: 18, height: 12, overflow: 'hidden' }}>
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 18,
              height: 12,
              borderRadius: 1,
              backgroundColor: 'rgb(85,17,180)',
              boxShadow: '0px 4px 20px 6px rgb(85,17,180)',
            }}
          />
          <Text
            style={[signText, { position: 'absolute', left: 2, top: 2, width: 14, fontSize: 7, lineHeight: 8, textShadowColor: 'rgb(4,154,235)' }]}>
            R|P
          </Text>
        </View>
        <View style={{ position: 'absolute', left: 3, top: 12, width: 2, height: 3, backgroundColor: 'rgb(70,21,140)' }} />
        <View style={{ position: 'absolute', left: 13, top: 12, width: 2, height: 3, backgroundColor: 'rgb(70,21,140)' }} />
      </View>

      {/* START tower */}
      <View style={{ position: 'absolute', left: 96, top: 98, width: 65, height: 142, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, top: 0, width: 54, height: 142, backgroundColor: 'rgb(0,0,0)' }} />
        <View
          style={{
            position: 'absolute',
            left: 43,
            top: 13,
            width: 22,
            height: 58,
            borderRadius: 1,
            backgroundColor: 'rgb(4,154,235)',
            boxShadow: '0px 4px 20px 6px rgb(4,154,235)',
          }}
        />
        <Text
          style={[signText, { position: 'absolute', left: 47, top: 16, width: 14, fontSize: 10, lineHeight: 10, textShadowColor: 'rgb(17,52,180)' }]}>
          {'S\nT\nA\nR\nT'}
        </Text>
      </View>

      {/* Notched building with pink trim */}
      <View style={{ position: 'absolute', left: 325, top: 125, width: 102, height: 123, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 0, top: 2, width: 94, height: 121, overflow: 'hidden' }}>
          <Svg width={90} height={110} viewBox="0 0 90 110" fill="none" style={{ position: 'absolute', left: 4, top: 0 }}>
            <Path d="M 0 0 L 45 0 L 45 18 L 90 18 L 90 110 L 0 110 L 0 0 Z" fill="rgb(0,0,0)" />
          </Svg>
          <View style={{ position: 'absolute', left: 0, top: 19, width: 8, gap: 10 }}>
            {[...Array(4)].map((_, i) => (
              <View key={i} style={{ height: 18, backgroundColor: 'rgb(0,0,0)', alignSelf: 'stretch' }} />
            ))}
          </View>
        </View>
        <View style={{ position: 'absolute', left: 7, top: 0, width: 27, height: 2, backgroundColor: 'rgb(235,103,202)' }} />
        <View style={{ position: 'absolute', left: 40, top: 12, width: 62, height: 2, backgroundColor: 'rgb(235,103,202)' }} />
        <View style={{ position: 'absolute', left: 42, top: 0, width: 4, height: 2, backgroundColor: 'rgb(235,103,202)' }} />
      </View>

      {/* Left cluster: window-grid building + R|P billboard */}
      <View style={{ position: 'absolute', left: 3, top: 8, width: 131, height: 251, overflow: 'hidden' }}>
        <LinearGradient
          colors={['rgb(0,0,0)', 'rgb(109,82,110)']}
          style={{ position: 'absolute', left: 49, top: 0, width: 16, height: 116 }}
        />
        <View style={{ position: 'absolute', left: 8, top: 41, width: 85, height: 210, backgroundColor: 'rgb(0,0,0)' }} />
        <WindowRow top={51} />
        <WindowRow top={74} />
        <WindowRow top={97} />
        <WindowRow top={120} />
        <WindowRow top={162} />
        <View style={{ position: 'absolute', left: 4, top: 147, width: 108, height: 9, backgroundColor: 'rgb(31,31,31)' }} />
        <View style={{ position: 'absolute', left: 0, top: 150, width: 115, height: 3, backgroundColor: 'rgb(0,0,0)' }} />
        <View style={{ position: 'absolute', left: 28, top: 28, width: 13, height: 17, backgroundColor: 'rgb(0,0,0)' }} />
        <View style={{ position: 'absolute', left: 32, top: 37, width: 57, height: 8, backgroundColor: 'rgb(0,0,0)' }} />
        <View style={{ position: 'absolute', left: 88, top: 50, width: 43, height: 93, overflow: 'hidden' }}>
          <View
            style={{
              position: 'absolute',
              left: 5,
              top: 0,
              width: 38,
              height: 93,
              overflow: 'hidden',
              borderRadius: 1,
              boxShadow: '0px 4px 20px 0px rgb(131,82,159)',
            }}>
            <View
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 38,
                height: 93,
                borderRadius: 5,
                backgroundColor: 'rgb(220,160,255)',
                boxShadow: '0px 4px 20px 6px rgb(131,82,159)',
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 46.399,
                top: -16,
                width: 19,
                height: 120,
                backgroundColor: 'rgb(234,198,255)',
                transformOrigin: 'top left',
                transform: [{ rotate: '35.3deg' }],
              }}
            />
            <View
              style={{
                position: 'absolute',
                left: 55.912,
                top: 19.744,
                width: 7.339,
                height: 120,
                backgroundColor: 'rgb(234,198,255)',
                transformOrigin: 'top left',
                transform: [{ rotate: '35.3deg' }],
              }}
            />
            <Text
              style={[signText, { position: 'absolute', left: 6, top: 11, width: 26, fontSize: 32, lineHeight: 32, textShadowColor: 'rgb(199,49,214)' }]}>
              {'R\nP'}
            </Text>
          </View>
          <View style={{ position: 'absolute', left: 0, top: 65, width: 5, height: 9, backgroundColor: 'rgb(75,11,111)' }} />
          <View style={{ position: 'absolute', left: 0, top: 16, width: 5, height: 9, backgroundColor: 'rgb(75,11,111)' }} />
        </View>
        <View style={{ position: 'absolute', left: 18, top: 63, width: 6, height: 2, backgroundColor: 'rgb(150,88,189)' }} />
        <View style={{ position: 'absolute', left: 30, top: 86, width: 6, height: 2, backgroundColor: 'rgb(150,88,189)' }} />
        <View style={{ position: 'absolute', left: 42, top: 109, width: 6, height: 2, backgroundColor: 'rgb(150,88,189)' }} />
        <View style={{ position: 'absolute', left: 54, top: 132, width: 6, height: 2, backgroundColor: 'rgb(150,88,189)' }} />
        <View style={{ position: 'absolute', left: 30, top: 174, width: 6, height: 2, backgroundColor: 'rgb(150,88,189)' }} />
      </View>

      {/* Foreground road with streetlights */}
      <View style={{ position: 'absolute', left: 0, top: 177, width: 443, height: 67, overflow: 'hidden' }}>
        <View style={{ position: 'absolute', left: 82, top: 34, width: 29, height: 33, backgroundColor: 'rgb(29,29,29)' }} />
        <View style={{ position: 'absolute', left: 75, top: 34, width: 41, height: 19, backgroundColor: 'rgb(29,29,29)' }} />
        <View style={{ position: 'absolute', left: 194, top: 34, width: 41, height: 19, backgroundColor: 'rgb(29,29,29)' }} />
        <View style={{ position: 'absolute', left: 200, top: 34, width: 29, height: 33, backgroundColor: 'rgb(29,29,29)' }} />
        <View style={{ position: 'absolute', left: 312, top: 34, width: 41, height: 19, backgroundColor: 'rgb(29,29,29)' }} />
        <View style={{ position: 'absolute', left: 318, top: 34, width: 29, height: 33, backgroundColor: 'rgb(29,29,29)' }} />
        <View style={{ position: 'absolute', left: 99, top: 41, width: 17, height: 12, backgroundColor: 'rgb(19,19,19)' }} />
        <View style={{ position: 'absolute', left: 218, top: 41, width: 17, height: 12, backgroundColor: 'rgb(19,19,19)' }} />
        <View style={{ position: 'absolute', left: 224, top: 41, width: 5, height: 22, backgroundColor: 'rgb(19,19,19)' }} />
        <View style={{ position: 'absolute', left: 342, top: 41, width: 5, height: 22, backgroundColor: 'rgb(19,19,19)' }} />
        <View style={{ position: 'absolute', left: 106, top: 41, width: 5, height: 22, backgroundColor: 'rgb(19,19,19)' }} />
        <View style={{ position: 'absolute', left: 336, top: 41, width: 17, height: 12, backgroundColor: 'rgb(19,19,19)' }} />
        <View style={{ position: 'absolute', left: 14, top: 23, width: 402, height: 18, backgroundColor: 'rgb(29,29,29)' }} />
        <View style={{ position: 'absolute', left: 0, top: 19, width: 416, height: 8, backgroundColor: 'rgb(59,59,59)' }} />
        <View style={{ position: 'absolute', left: 0, top: 23, width: 443, height: 5, backgroundColor: 'rgb(19,19,19)' }} />
        <View style={{ position: 'absolute', left: 48, top: 0, flexDirection: 'row', gap: 70, alignItems: 'center' }}>
          {[...Array(5)].map((_, i) => (
            <Streetlight key={i} />
          ))}
        </View>
      </View>
    </View>
  );
}
