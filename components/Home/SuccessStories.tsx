import React, { useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    StyleProp,
    ViewStyle,
    TextStyle,
    ImageStyle,
} from 'react-native';
import Video from 'react-native-video';
import success1 from '../../assets/home/success1.png';
import success2 from '../../assets/home/success2.png';
import { getData } from '../../global/server';
import { retrieveData } from '../../utils/Storage';

// Define types for Success Stories
interface StaticStory {
    title: string;
    desc: string;
    image: any; // Use `ImageSourcePropType` if importing images statically
    videoUri: string | any; // Support both URI string and local video file
}

interface ApiStory {
    title: string;
    description: string;
    beforeStoryImg: string;
    afterStoryImg: string;
}

const Success: StaticStory[] = [
    {
        title: 'Story of Gurpreet Singh Batra',
        desc: 'Injured and Depression to Founder of GSBPATHY',
        image: success1,
        videoUri: require('../../assets/localVideo.mp4'),
    },
    {
        title: 'Fitness is key of Success',
        desc: 'Injured and Depression to Founder of GSBPATHY',
        image: success2,
        videoUri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    },
];

const SuccessStories: React.FC = () => {
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);
    const [token, setToken] = useState<string>('');
    const [stories, setStories] = useState<ApiStory[]>([]);

    const handlePress = (videoUri: string | any) => {
        setCurrentVideo(videoUri === currentVideo ? null : videoUri); // Toggle playback on click
    };

    useEffect(() => {
        const successStories = async () => {
            try {
                const storedToken = await retrieveData('token');
                if (!storedToken) {
                    console.error('Token not found');
                    return;
                }
                console.log('storedToken', storedToken);
                setToken(storedToken);

                const response = await getData('/api/story/homeStories', storedToken);
                console.log('response', response);
                if (response) {
                    setStories(response);
                } else {
                    console.error('Invalid API response');
                }
            } catch (error: any) {
                console.error('Error fetching stories:', error.message);
            }
        };

        successStories();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>SUCCESS STORIES</Text>

            {/* Static Success Stories */}
            {/* <View style={styles.videoContainer}>
                {Success.map((item, index) => (
                    <View key={index} style={styles.storyCard}>
                        <TouchableOpacity onPress={() => handlePress(item.videoUri)}>
                            {currentVideo === item.videoUri ? (
                                <Video
                                    source={
                                        typeof item.videoUri === 'string'
                                            ? { uri: item.videoUri }
                                            : item.videoUri
                                    }
                                    style={styles.video}
                                    resizeMode="cover"
                                    paused={currentVideo !== item.videoUri}
                                    controls
                                />
                            ) : (
                                <Image source={item.image} style={styles.thumbnail} />
                            )}
                        </TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={styles.storyTitle}>{item.title}</Text>
                            <Text style={styles.storyDesc}>{item.desc}</Text>
                        </View>
                    </View>
                ))}
            </View> */}

            {/* Dynamic Stories from API */}
            <View style={styles.apiStoriesContainer}>
                {stories.map((story, index) => (
                    <View key={index} style={styles.storyCard}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: story.beforeStoryImg }} style={styles.imageThumbnail} />
                            <Image source={{ uri: story.afterStoryImg }} style={styles.imageThumbnail} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.storyTitle}>{story.title}</Text>
                            <Text style={styles.storyDesc}>{story.description}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default SuccessStories;

const styles = StyleSheet.create({
    container: {
        width: '85%',
        marginLeft: 28,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: 'black',
    },
    videoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    apiStoriesContainer: {
        marginTop: 20,
    },
    storyCard: {
        width: '100%',
        borderRadius: 12,
        marginBottom: 20,
    },
    thumbnail: {
        height: 220,
        width: '100%',
        borderRadius: 16,
    },
    imageThumbnail: {
        height: 220,
        width: '50%',
    },
    video: {
        height: 220,
        width: '100%',
        borderRadius: 16,
    },
    textContainer: {
        marginTop: 20,
    },
    storyTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: 'black',
    },
    storyDesc: {
        color: 'black',
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 25,
    },
});
