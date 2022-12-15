import { api } from '../services/api'
import Image from 'next/image'
import appPreviewImg from '../assets/app-copa-preview.png'
import logoImg from '../assets/logo.svg'
import userAvatarExample from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import styles from './home.module.scss'
import { FormEvent, useState } from 'react'
import Head from 'next/head'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props: HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()
    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      })

      const { code } = response.data

      navigator.clipboard.writeText(code)

      alert(
        'Bolão criado com sucesso, o código foi copiado para a área de transferência!'
      )

      setPoolTitle('')
    } catch (err) {
      console.log(err)
      alert('Falha ao criar o bolão')
    }
  }

  return (
    <div className={styles.HomeContainer}>
      <Head>
        <title>Nlw Copa</title>
        <link rel="shortcut icon" href="/worldcup.svg" />
      </Head>
      <main className={styles.HomeContent}>
        <Image src={logoImg} width={310} height={180} alt="Logo" />

        <h1 className={styles.title}>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className={styles.users}>
          <Image src={userAvatarExample} alt="" />

          <strong>
            <span>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className={styles.form}>
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button type="submit">Criar meu bolão</button>
        </form>

        <p className={styles.description}>
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas
        </p>

        <div className={styles.createdPools}>
          <div className={styles.createdPoolsContent}>
            <Image src={iconCheckImg} alt="" />
            <div className={styles.createdPoolsText}>
              <span className={styles.createdPoolsNumber}>
                +{props.poolCount}
              </span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className={styles.createdPoolsDivide} />

          <div className={styles.createdPoolsContent}>
            <Image src={iconCheckImg} alt="" />
            <div className={styles.createdPoolsText}>
              <span className={styles.createdPoolsNumber}>
                +{props.guessCount}
              </span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da app mobile"
        quality={100}
      />
    </div>
  )
}

export async function getStaticProps() {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get('/pools/count'),
      api.get('/guesses/count'),
      api.get('/users/count'),
    ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  }
}
