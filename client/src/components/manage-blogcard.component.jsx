import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDay } from '../common/date'
import { UserContext } from '../App'
import axios from 'axios'


const BlogStats = ({stats}) => {
    return (
        <div className='flex gap-2 max-lg:mb-6 max-lg:pb-4 max-lg:border-grey max-lg:border-b '> 
            {
                Object.keys(stats).map((key, i) => {
                    return !key.includes("parent") ? <div key={i} className={'flex flex-col items-center w-full h-full justify-center p-4 px-6 ' + (i !== 0 ? 'border-grey border-l' : "" )}>
                    <h1 className='text-xl lg:text-2xl mb-2'>{stats[key].toLocaleString()}</h1>
                    <p className='max-lg:text-dark-grey capitalize'>{key.split('_')[1]}</p>
                </div> : ""
                })
            }
        </div>
    )
}

export const ManagePublishedBlogCard = ({blog}) => {

    let {userAuth: {access_token}} = useContext(UserContext)

    let { banner, blog_id, title, publishedAt, activity} = blog

    let [showStat, setShowStat] = useState(false)
  return (
    <>
        <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center '>
            <img src={banner} alt="banner img" className='max-md:hidden lg:hidden xl:block w-28 h-28 bg-grey object-cover'/>

            <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
                <div>
                    <Link to={`/blog/${blog_id}`} className='blog-title mb-4 hover:underline'>{title}</Link>

                    <p className='line-clamp-1'>Published on {getDay(publishedAt)}</p>
                </div>

                <div className='flex gap-6 mt-3'>
                    <Link to={`/editor/${blog_id}`} className='py-2 underline '>Edit</Link>

                    <button className='lg:hidden pr-4 py-2 underline' onClick={() => setShowStat(preVal => !preVal)}>Stats</button>

                    <button className='pr-4 py-2 underline text-red' onClick={(e) => deleteBlog(blog, access_token, e.target)}>Delete</button>

                </div>

            </div>

            <div className='max-lg:hidden'>
                <BlogStats stats={activity}/>
            </div>
        </div>
        {
            showStat && 
            <div className='max-lg:hidden'>
                <BlogStats stats={activity}/>
            </div>
        }
    </>
  )
}


export const ManageDraftBlogPost = ({blog}) => {
    let {title,blog_id, des, index} = blog
    index++;

    let {userAuth: {access_token}} = useContext(UserContext)
    return (
        <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>
            <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>{index < 10 ? "0" + index : index}</h1>

            <div>
                <h1 className='blog-title mb-3'>{title}</h1>
                <p className='line-clamp-2 font-gelasio'>{des.length ? des : "No Description"}</p>

                <div className='flex gap-6 mt-3'>
                    <Link className='pr-4 py-2 underline' to={`/editor/${blog_id}`}>Edit</Link>

                    <button className='pr-4 py-2 underline text-red' onClick={(e) => deleteBlog(blog, access_token, e.target)}>Delete</button>
                </div>
            </div>
        </div>
    )
}

const deleteBlog = (blog, access_token, target ) => {
    let {index, blog_id , setStateFunc} = blog;

    target.setAttribute('disable', true)

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/delete-blog', {blog_id}, {
        headers: {
            'Authorization' : `Bearer ${access_token}`
        }
    })
    .then(({data}) => {
        target.removeAttribute('disabled');
        setStateFunc(preVal => {
            let {deleteDocCount, totalDocs, results} = preVal;

            results.splice(index, 1);

            if(!deleteDocCount){
                deleteDocCount = 0;
            }
            if(!results.length && totalDocs - 1 > 0){
                return null;
            }

            return {...preVal, totalDocs: totalDocs-1, deleteDocCount: deleteDocCount+1}
        })
    })
    .catch(err => {
        console.log(err)
    })
}
// export default ManagePublishedBlogCard