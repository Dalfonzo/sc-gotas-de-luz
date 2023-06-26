import { GetServerSideProps } from 'next'
import { VolunteerDetails } from '~/components/admin/volunteers/Detail'
import UiFeedback from '~/components/common/feedback/UiFeedback'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import { VolunteerDetailResponse, getVolunteerDetails } from '~/pages/api/admin/volunteers/[id]'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'
interface Props {
  volunteer?: VolunteerDetailResponse | null
  error?: boolean
}

function EditNews({ volunteer, error }: Props) {
  return (
    <UiFeedback
      isLoading={!volunteer && !error}
      isEmpty={volunteer === null && !error}
      emptyMsg={['Voluntario no encontrado', 'Lo sentimos, no se encontró la información de este voluntario']}
      isError={error}
    >
      {' '}
      {volunteer && <VolunteerDetails volunteer={volunteer} />}
    </UiFeedback>
  )
}
export default withProtectedRoute(EditNews, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.VOLUNTEERS,
  title: 'voluntarios',
})

export const getServerSideProps: GetServerSideProps<Props> = async (req) => {
  const id = String(req.params?.id)
  try {
    const item = await getVolunteerDetails(id)
    return {
      props: { volunteer: item },
    }
  } catch (error) {
    return {
      props: { error: true },
    }
  }
}
