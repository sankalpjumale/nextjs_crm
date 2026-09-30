import { ReactNode } from 'react'

type PageHeaderProps = {
    title: string,
    description?: string,
    action?: ReactNode
}

function PageHeader({title, description, action}: PageHeaderProps) {
    return (
        <div className='flex items-center justify-between gap-4 pb-6'>
            <div>
                <h1 className='text-2xl font-semibold tracking-tight'>{title}</h1>
                {description ? (
                    <p className='text-sm text-muted-foreground'>{description}</p>
                ) : null}
            </div>
            [action ? <div>{action}</div> : null]
      </div>
  )
}

export default PageHeader