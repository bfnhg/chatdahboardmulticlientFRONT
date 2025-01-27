import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'

const ChatHistory = () => {
  const [conversationsData, setConversationsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.warn('Aucun token trouvé. Redirection ou autre gestion nécessaire.')

        return
      }

      const response = await axios.get('http://localhost:5000/api/client/conversations', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })

      console.log('Données reçues :', response.data)

      setConversationsData(response.data) // Stockez toutes les données reçues
      setLoading(false)
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations :', error)
      setLoading(false)
      setError(error.message)
    }
  }

  if (loading) return <Typography>Chargement des conversations...</Typography>
  if (error) return <Typography color='error'>{error}</Typography>

  return (
    <Box sx={{ height: '100vh', overflowY: 'scroll', p: 20 }}>
      {' '}
      {/* Appliquez le défilement à tout le Box */}
      <Typography variant='h6' sx={{ mb: 2 }}>
        Historique des Conversations de {conversationsData.client_name}
      </Typography>
      <List>
        {conversationsData.conversations.map(convo => (
          <Box key={convo.conversation_id} sx={{ mb: 4 }}>
            <Typography variant='subtitle1' sx={{ fontWeight: 'bold' }}>
              Conversation #{convo.conversation_id} (Dernier message :{' '}
              {new Date(convo.last_message_time).toLocaleString()})
            </Typography>
            <List>
              {convo.messages.map(message => (
                <ListItem key={message.message_id} alignItems='flex-start'>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant='body1' sx={{ fontWeight: 500 }}>
                          Vous : {message.user_message}
                        </Typography>
                        <Typography variant='body1' color='text.secondary'>
                          Assistant : {message.assistant_message}
                        </Typography>
                      </Box>
                    }
                    secondary={`Envoyé à : ${new Date(message.timestamp).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </List>
    </Box>
  )
}

export default ChatHistory
