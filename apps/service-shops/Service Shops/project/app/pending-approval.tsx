// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { Clock } from 'lucide-react-native';

// export default function PendingApproval() {
//   return (
//     <View style={styles.container}>
//       <View style={styles.iconContainer}>
//         <Clock size={80} color="#19034d" />
//       </View>

//       <Text style={styles.title}>Registration Under Review</Text>

//       <Text style={styles.message}>
//         Your registration has been submitted successfully. Our admin team will verify your documents within 24 hours.
//       </Text>

//       <Text style={styles.subMessage}>
//         You will receive an email notification once your account is approved.
//       </Text>

//       <View style={styles.infoBox}>
//         <Text style={styles.infoTitle}>What happens next?</Text>
//         <Text style={styles.infoText}>
//           1. Admin reviews your documents{'\n'}
//           2. You receive approval email{'\n'}
//           3. Set up your password{'\n'}
//           4. Complete onboarding{'\n'}
//           5. Start accepting jobs
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   iconContainer: {
//     width: 160,
//     height: 160,
//     borderRadius: 80,
//     backgroundColor: '#f0ebf8',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#19034d',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   message: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 12,
//   },
//   subMessage: {
//     fontSize: 14,
//     color: '#999',
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   infoBox: {
//     backgroundColor: '#f0ebf8',
//     padding: 20,
//     borderRadius: 12,
//     width: '100%',
//     borderLeftWidth: 4,
//     borderLeftColor: '#19034d',
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#19034d',
//     marginBottom: 12,
//   },
//   infoText: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 22,
//   },
// });



import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PendingApproval() {
  const router = useRouter();

  const handleGoToDashboard = () => {
    // Navigate to the main tab layout (Home screen)
    router.replace("/dashboard");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Clock size={80} color="#19034d" />
      </View>

      <Text style={styles.title}>Registration Under Review</Text>

      <Text style={styles.message}>
        Your registration has been submitted successfully. Our admin team will verify your documents within 24 hours.
      </Text>

      <Text style={styles.subMessage}>
        You will receive an email notification once your account is approved.
      </Text>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>What happens next?</Text>
        <Text style={styles.infoText}>
          1. Admin reviews your documents{'\n'}
          2. You receive approval email{'\n'}
          3. Set up your password{'\n'}
          4. Complete onboarding{'\n'}
          5. Start accepting jobs
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleGoToDashboard}>
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#f0ebf8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#19034d',
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  subMessage: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
  },
  infoBox: {
    backgroundColor: '#f0ebf8',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#19034d',
    marginBottom: 40,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#19034d',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#19034d',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
